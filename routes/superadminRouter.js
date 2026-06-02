const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  getAllUsers,
  deleteUser,
  getAllFiles,
  deleteFile,
  changeRole,
} = require("../controller/superadminController");

const checkAuth = require("../middleware/checkAuth");
const checkSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as superadmin" });
    }
};

// Dashboard
router.get(
  "/dashboard",
  checkAuth,
  checkSuperAdmin,
  getDashboardStats
);

// Admin Management
router.get(
  "/admins",
  checkAuth,
  checkSuperAdmin,
  getAllAdmins
);

router.post(
  "/admins",
  checkAuth,
  checkSuperAdmin,
  createAdmin
);

router.delete(
  "/admins/:id",
  checkAuth,
  checkSuperAdmin,
  deleteAdmin
);

// User Management
router.get(
  "/users",
  checkAuth,
  checkSuperAdmin,
  getAllUsers
);

router.delete(
  "/users/:id",
  checkAuth,
  checkSuperAdmin,
  deleteUser
);

// File Management
router.get(
  "/files",
  checkAuth,
  checkSuperAdmin,
  getAllFiles
);

router.delete(
  "/files/:id",
  checkAuth,
  checkSuperAdmin,
  deleteFile
);

// Role Management
router.put(
  "/roles/:id",
  checkAuth,
  checkSuperAdmin,
  changeRole
);

module.exports = router;