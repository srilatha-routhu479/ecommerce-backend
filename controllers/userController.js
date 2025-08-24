import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";

// POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ create empty cart for this user
    await Cart.create({ userId: newUser._id, items: [] });

    // ✅ generate token
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Incoming login request:", req.body);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(400).json({ message: "Invalid credentials (email)" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔑 Entered password:", password);
    console.log("🔒 Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("👉 bcrypt.compare result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials (password)" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


