const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "YOUR_CLOUD_NAME_HERE") {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "file_sharing_app", 
      resource_type: "raw", // Use 'raw' to explicitly allow ALL file types including generic non-media files
    },
  });
} else {
  console.warn("Cloudinary not configured properly. Falling back to local disk storage for all file types.");
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, "_"));
    }
  });
}

// Multer configured to accept any file type
const upload = multer({ storage: storage });

module.exports = upload;
