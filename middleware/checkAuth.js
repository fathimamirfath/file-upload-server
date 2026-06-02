const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Look up user and attach to req
      req.user = await User.findById(decoded.id).select("-password");
      req.id = decoded.id; // Keep req.id for backwards compatibility

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Not Authorized" });
      }

      return next(); 
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }
};

module.exports = protect;