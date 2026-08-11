const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { adminOnly } = require("../middleware/auth");
const { LOCAL_UPLOADS_ENABLED } = require("../config");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"]
]);

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function parseDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(String(dataUrl || ""));
  if (!match) {
    return null;
  }
  return {
    mimeType: match[1],
    base64: match[2]
  };
}

router.post("/images", adminOnly, (req, res) => {
  if (!LOCAL_UPLOADS_ENABLED) {
    return res.status(501).json({
      message:
        "Image uploads need persistent file storage in production. Use an externally hosted image URL, or configure a storage service such as Vercel Blob."
    });
  }

  const images = Array.isArray(req.body?.images) ? req.body.images : [];

  if (!images.length) {
    return res.status(400).json({ message: "Select at least one image to upload." });
  }

  if (images.length > MAX_IMAGES) {
    return res.status(400).json({ message: `You can upload up to ${MAX_IMAGES} images.` });
  }

  ensureUploadDir();

  const uploaded = [];
  for (const image of images) {
    const parsed = parseDataUrl(image.dataUrl);
    if (!parsed || !ALLOWED_TYPES.has(parsed.mimeType)) {
      return res.status(400).json({
        message: "Only JPG, PNG, WebP, GIF, or AVIF images can be uploaded."
      });
    }

    const buffer = Buffer.from(parsed.base64, "base64");
    if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
      return res.status(400).json({ message: "Each image must be 5MB or smaller." });
    }

    const extension = ALLOWED_TYPES.get(parsed.mimeType);
    const filename = `${Date.now()}-${uuid()}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    uploaded.push({
      filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${filename}`
    });
  }

  return res.status(201).json({ images: uploaded });
});

module.exports = router;
