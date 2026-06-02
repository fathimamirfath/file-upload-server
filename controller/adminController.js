const User = require("../models/userModel");
const File = require("../models/fileModel");
const cloudinary = require("cloudinary").v2;

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFiles = await File.countDocuments();

    const teamFiles = await File.countDocuments({
      sharedWith: { $exists: true, $ne: [] },
    });

    const files = await File.find();

    const storageUsed = files.reduce(
      (total, file) => total + (file.fileSize || 0),
      0
    );

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalFiles,
      teamFiles,
      storageUsed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Files
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("uploadedBy", "name email")
      .populate("sharedWith", "name email");

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Team Files
const getTeamFiles = async (req, res) => {
  try {
    const files = await File.find({
      sharedWith: { $exists: true, $ne: [] },
    })
      .populate("uploadedBy", "name email")
      .populate("sharedWith", "name email");

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllFiles,
  getTeamFiles,
  deleteUser,
  deleteFile
};