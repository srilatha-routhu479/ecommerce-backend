import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ COD Orders only
router.post("/", protect, createOrder);

// ✅ User: Get My Orders
router.get("/myorders", protect, getMyOrders);

// ✅ Admin: Get All Orders
router.get("/", protect, admin, getAllOrders);

// ✅ Admin: Update Order Status
router.put("/:id", protect, admin, updateOrderStatus);

export default router;

