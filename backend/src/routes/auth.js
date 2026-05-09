const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { JWT_SECRET, TOKEN_EXPIRY } = require("../config");
const {
  nowIso,
  readDb,
  writeDb,
  sanitizeUser,
  getOrCreateCart,
  getOrCreateWishlist,
  getOrCreateRecentView
} = require("../data/store");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isStrongPassword(password) {
  const candidate = String(password || "");
  return (
    candidate.length >= 8 &&
    /[A-Z]/.test(candidate) &&
    /[a-z]/.test(candidate) &&
    /\d/.test(candidate)
  );
}

function cleanExpiredResets(db) {
  const now = Date.now();
  db.passwordResets = db.passwordResets.filter(
    (entry) => new Date(entry.expiresAt).getTime() > now && !entry.usedAt
  );
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
    });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const db = readDb();

  if (db.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const timestamp = nowIso();
  const user = {
    id: uuid(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    role: "customer",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  db.users.push(user);
  getOrCreateCart(db, user.id);
  getOrCreateWishlist(db, user.id);
  getOrCreateRecentView(db, user.id);
  writeDb(db);

  const token = issueToken(user);
  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const db = readDb();
  const user = db.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = issueToken(user);
  return res.json({ token, user: sanitizeUser(user) });
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const db = readDb();
  cleanExpiredResets(db);

  const user = db.users.find((entry) => entry.email === normalizedEmail);
  if (!user) {
    writeDb(db);
    return res.json({
      message: "If the email exists, a reset link has been generated.",
      resetToken: null
    });
  }

  const resetToken = uuid().replace(/-/g, "");
  const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  db.passwordResets.push({
    id: uuid(),
    userId: user.id,
    token: resetToken,
    expiresAt: expiry,
    createdAt: nowIso()
  });

  writeDb(db);

  return res.json({
    message: "Password reset token generated. Use it to create a new password.",
    resetToken,
    expiresAt: expiry
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
    });
  }

  const db = readDb();
  cleanExpiredResets(db);
  const tokenEntry = db.passwordResets.find((entry) => entry.token === String(token).trim());

  if (!tokenEntry) {
    writeDb(db);
    return res.status(400).json({ message: "Reset token is invalid or expired." });
  }

  const user = db.users.find((entry) => entry.id === tokenEntry.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found for token." });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.updatedAt = nowIso();
  tokenEntry.usedAt = nowIso();
  writeDb(db);

  return res.json({ message: "Password updated successfully. You can now login." });
});

router.get("/me", authRequired, (req, res) => {
  const db = readDb();
  const user = db.users.find((entry) => entry.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.json({ user: sanitizeUser(user) });
});

router.patch("/me", authRequired, async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const db = readDb();
  const user = db.users.find((entry) => entry.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (name !== undefined) {
    user.name = String(name).trim();
  }

  if (newPassword !== undefined) {
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters and include uppercase, lowercase, and a number."
      });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  user.updatedAt = nowIso();
  writeDb(db);
  return res.json({ message: "Profile updated successfully.", user: sanitizeUser(user) });
});

module.exports = router;
