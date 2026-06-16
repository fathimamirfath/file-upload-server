const File = require("../models/fileModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Upload a file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        // If uploaded to Cloudinary, path starts with http. Otherwise, construct local URL.
        const isCloudinary = req.file.path && req.file.path.startsWith("http");
        const fileUrl = isCloudinary 
            ? req.file.path 
            : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
        const publicId = isCloudinary ? req.file.filename : null;
        
        // Find user to update storage (optional, but good practice)
        const user = await User.findById(req.id);
        if(user) {
           user.storageUsed += req.file.size;
           await user.save();
        }

        const newFile = await File.create({
            user: req.id,
            uploadedBy: req.id,
            fileName: req.file.originalname,
            fileUrl: fileUrl,
            publicId: publicId,
            fileSize: req.file.size,
            fileType: req.file.mimetype.split("/")[0] === "image" ? "image" : 
                      req.file.mimetype.includes("pdf") ? "pdf" : 
                      req.file.mimetype.includes("zip") ? "zip" : "doc",
            sharedWith: []
        });

        res.status(201).json(newFile);
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get My Files
const getMyFiles = async (req, res) => {
    try {
        const files = await File.find({ user: req.id }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete File
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.user.toString() !== req.id) {
            return res.status(401).json({ message: "Not authorized to delete this file" });
        }

        if (file.publicId) {
            await cloudinary.uploader.destroy(file.publicId);
        } else {
            // Fallback for old local files
            const filename = file.fileUrl.split("/").pop();
            const filepath = path.join(__dirname, "..", "uploads", filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        const user = await User.findById(req.id);
        if (user) {
            user.storageUsed = Math.max(0, user.storageUsed - file.fileSize);
            await user.save();
        }

        await File.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "File removed" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Share File
const shareFile = async (req, res) => {
   try {
       const file = await File.findById(req.params.id);
       const { email } = req.body;
       const userToShare = await User.findOne({ email });

       if (!userToShare) return res.status(404).json({ message: "User not found" });
       if (!file) return res.status(404).json({ message: "File not found" });

       if (!file.sharedWith.includes(userToShare._id)) {
           file.sharedWith.push(userToShare._id);
           await file.save();
       }
       res.status(200).json(file);
   } catch (error) {
       res.status(500).json({ message: "Server Error" });
   }
}

// Get Shared Files
const getSharedFiles = async (req, res) => {
    try {
        const files = await File.find({ sharedWith: req.id }).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching shared files:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    uploadFile,
    getMyFiles,
    deleteFile,
    shareFile,
    getSharedFiles
};