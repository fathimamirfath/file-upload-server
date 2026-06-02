const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllFiles,
  getTeamFiles,
  deleteUser,
  deleteFile
} = require("../controller/adminController");

const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

// Dashboard
router.get(
  "/dashboard",
  checkAuth,
  checkAdmin,
  getDashboardStats
);

// Users
router.get(
  "/users",
  checkAuth,
  checkAdmin,
  getAllUsers
);

// Delete User
router.delete(
  "/users/:id",
  checkAuth,
  checkAdmin,
  deleteUser
);

// Files
router.get(
  "/files",
  checkAuth,
  checkAdmin,
  getAllFiles
);

// Team Files
router.get(
  "/team-files",
  checkAuth,
  checkAdmin,
  getTeamFiles
);
router.delete(
  "/files/:id",
  checkAuth,
  checkAdmin,
  deleteFile
);

module.exports = router;