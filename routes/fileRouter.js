const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadFile, getMyFiles, deleteFile, shareFile, getSharedFiles } = require("../controller/fileController");
const checkAuth = require("../middleware/checkAuth");

// Routes
router.post("/upload", checkAuth, upload.single("file"), uploadFile);
router.get("/myfiles", checkAuth, getMyFiles);
router.get("/sharedfiles", checkAuth, getSharedFiles);
router.delete("/:id", checkAuth, deleteFile);
router.post("/:id/share", checkAuth, shareFile);

module.exports = router;