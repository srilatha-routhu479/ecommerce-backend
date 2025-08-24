// routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all users (admin only)
router.get("/users", protect, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ✅ Get all orders (admin only)
router.get("/orders", protect, admin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
});





export default router;

