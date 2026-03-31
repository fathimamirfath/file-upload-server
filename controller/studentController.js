const Student = require("../models/studentModel");

const getStudent = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

const addStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student Deleted" });
};

const updateStudent = async (req, res) => {
  const { id } = req.params;

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json(updatedStudent);
};

module.exports = { getStudent,addStudent,deleteStudent,updateStudent,};