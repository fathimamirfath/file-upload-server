const express = require("express");
const { registerUser, loginUser, getUserProfile, updateProfile, updateAvatar, updatePassword } = require("../controller/userController");
const checkAuth = require("../middleware/checkAuth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", checkAuth, getUserProfile);
router.put("/update-profile", checkAuth, updateProfile);
router.put("/update-avatar", checkAuth, upload.single("avatar"), updateAvatar);
router.put("/update-password", checkAuth, updatePassword);

module.exports = router;
