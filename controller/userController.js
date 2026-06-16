const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Generate a JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Send the response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                storageUsed: newUser.storageUsed,
                avatar: newUser.avatar,
                phone: newUser.phone,
                place: newUser.place
            }
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server Error during registration." });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 4. Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storageUsed: user.storageUsed,
                avatar: user.avatar,
                phone: user.phone,
                place: user.place
            }
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Server Error during login.", details: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ message: "Server Error fetching profile." });
    }
};

// Update user profile (name, email, phone, place)
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, place } = req.body;
        
        // Find user
        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already in use" });
            user.email = email;
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (place !== undefined) user.place = place;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storageUsed: user.storageUsed,
                avatar: user.avatar,
                phone: user.phone,
                place: user.place
            }
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Server Error updating profile." });
    }
};

// Update user avatar
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.avatar = req.file.path; // Cloudinary URL
        await user.save();

        res.status(200).json({
            message: "Avatar updated successfully",
            avatar: user.avatar
        });
    } catch (error) {
        console.error("Error in updateAvatar:", error);
        res.status(500).json({ message: "Server Error updating avatar." });
    }
};

// Update user password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide current and new password." });
        }

        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in updatePassword:", error);
        res.status(500).json({ message: "Server Error updating password." });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
    updateAvatar,
    updatePassword
};
