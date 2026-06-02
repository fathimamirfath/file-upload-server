const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDb = require("./config/db");
const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const adminRouter = require("./routes/adminRouter");

const superAdminRoutes = require("./routes/superadminRouter");


const app = express();

connectDb();

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