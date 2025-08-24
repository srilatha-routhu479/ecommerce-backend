import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------ ROUTES ------------------

// 🔹 Get all products
router.get("/", getAllProducts);

// 🔹 Get product by ID
router.get("/:id", getProductById);

// 🔹 Create product (admin only)
router.post("/", protect, admin, createProduct);

// 🔹 Delete product (admin only)
router.delete("/:id", protect, admin, deleteProduct);

export default router;
