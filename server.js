const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDb = require("./config/db");
const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const adminRouter = require("./routes/adminRouter");

const superAdminRoutes = require("./routes/superadminRouter");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");



const app = express();

const seedSuperAdmin = async () => {
    try {
        const superAdminExists = await User.findOne({ role: "superadmin" });
        if (!superAdminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            await User.create({
                name: "Super Admin",
                email: "superadmin@admin.com",
                password: hashedPassword,
                role: "superadmin",
            });
            console.log("Super Admin seeded successfully.");
        }
    } catch (error) {
        console.error("Error seeding Super Admin:", error);
    }
};

connectDb().then(seedSuperAdmin);
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routers
app.use("/api/users", userRouter);
app.use("/api/files", fileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/superadmin", superAdminRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});