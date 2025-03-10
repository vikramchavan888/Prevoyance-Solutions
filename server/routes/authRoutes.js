// routes/authRoutes.js
import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // local images go into "uploads/"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ---------------------
   2. Multer Storage for Excel (Bulk Upload)
---------------------- */
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/excel"); // Excel files go into "uploads/excel"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const excelUpload = multer({ storage: excelStorage });

/* ========== REGISTRATION ========== */
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { firstName, lastName, email, password, mobile, address } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    const db = await connectToDatabase();
    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "User already existed" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      `INSERT INTO users (first_name, last_name, email, password, mobile, address, profile_picture)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashPassword,
        mobile,
        address,
        profilePicture,
      ]
    );
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== LOGIN ========== */
router.post("/login", upload.none(), async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: "3h",
    });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== Verify Token Middleware ========== */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ========== Get All Users (Protected) ========== */
router.get("/users", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users");
    return res.status(200).json({ users: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== Update User ========== */
router.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, mobile, address } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, address = ? WHERE id = ?",
      [first_name, last_name, email, mobile, address, id]
    );
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== Delete User ========== */
router.delete("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== Get Logged-In User Details ========== */
router.get("/home", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ========== Bulk Upload Excel ========== */
router.post(
  "/bulk-upload",
  verifyToken,
  excelUpload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read and parse the Excel file
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      const db = await connectToDatabase();

      // Process each row
      for (const row of rows) {
        // Extract registration fields
        const firstName = row.firstName || row.FirstName;
        const lastName = row.lastName || row.LastName;
        const email = row.email || row.Email;
        const password = row.password || row.Password;
        const mobile = row.mobile || row.Mobile;
        const address = row.address || row.Address;

        // Extract the profile picture value from Excel.
        // We expect this value to be either a valid URL or a filename.
        let profilePictureValue =
          row.profilePicture || row.profile_picture || row.ImagePath;
        if (profilePictureValue) {
          profilePictureValue = profilePictureValue.toString().trim();
          
        }

        // Skip rows missing required fields
        if (!firstName || !lastName || !email || !password) {
          continue;
        }

        // Check if the user already exists
        const [existing] = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );
        if (existing.length > 0) {
          continue;
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user record with the extracted profile picture value (as-is)
        await db.query(
          `INSERT INTO users (first_name, last_name, email, password, mobile, address, profile_picture)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            firstName,
            lastName,
            email,
            hashedPassword,
            mobile,
            address,
            profilePictureValue,
          ]
        );
      }

      return res.status(201).json({ message: "Bulk upload successful" });
    } catch (error) {
      console.error("Bulk upload error:", error);
      return res
        .status(500)
        .json({ message: "Bulk upload failed", error: error.message });
    }
  }
);

export default router;