const User = require("../models/userModel");
const File = require("../models/fileModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFiles = await File.countDocuments();

    const files = await File.find();

    const storageUsed = files.reduce(
      (total, file) => total + (file.fileSize || 0),
      0
    );

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalFiles,
      storageUsed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    }).select("-password");

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password");

    res.status(200).json(users);
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

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
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

// Delete File
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
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change User Role
const changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  getAllUsers,
  deleteUser,
  getAllFiles,
  deleteFile,
  changeRole,
};