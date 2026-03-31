const express = require("express");
const router = express.Router();

const {getStudent,addStudent,deleteStudent, updateStudent,} = require("../controller/studentController");
router.get("/", getStudent);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);

module.exports = router; 