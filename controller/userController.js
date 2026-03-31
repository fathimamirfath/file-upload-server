// module.exports = protect;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
    

let register = async (req, res) => {

  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: "Registered Successfully" }); 
}

let login = async (req, res) => {
  const { email, password } = req.body;
 console.log(req.body,"req.body"); 
 
  const user = await User.findOne({email});
  console.log(user,"user");
  
  if (!user) return res.status(400).json({ message: "Invalid Email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ token });
}



module.exports = {
  register,
  login
};