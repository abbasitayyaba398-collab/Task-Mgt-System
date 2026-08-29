// backend/middleware/upload.js
//
// Task attachment file upload ke liye Multer setup.
// Files "uploads/" folder mein save hoti hain (disk storage),
// aur server.js unhein "/uploads/<filename>" ke through static
// serve karta hai taake frontend se direct link/download ho sake.

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

// Agar "uploads" folder maujood nahi to bana do
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Unique naam taake do log filon ka naam takra na jaye
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;

    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

// 10MB tak file allow — zarurat ho to yahan se badha/ghata sakte hain
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;