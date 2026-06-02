const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "file_sharing_app", 
    resource_type: "auto", // Allows uploading non-image files (like PDFs, zips)
    allowed_formats: ["jpg", "png", "pdf", "zip", "doc", "docx", "txt", "mp4"], 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
