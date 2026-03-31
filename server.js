const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");

require("dotenv").config()
connectDb()

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRouter");

app.use("/api/students", studentRoutes);

app.use("/api/user", userRoutes);


app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT,() =>{
    console.log(`server running on http://localhost:${PORT}`);
});