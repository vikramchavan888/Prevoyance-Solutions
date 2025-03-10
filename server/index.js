// server.js
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Ensure "uploads" and "uploads/excel" directories exist
const uploadsDir = path.join(process.cwd(), "uploads");
const excelDir = path.join(uploadsDir, "excel");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir);
}

// Serve static files from "uploads"
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());

// Use authentication routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
