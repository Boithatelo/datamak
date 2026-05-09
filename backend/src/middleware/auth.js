const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { readDb } = require("../data/store");

async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = await readDb();
    const user = db.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid token user." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }
  return next();
}

module.exports = {
  authRequired,
  adminOnly
};
