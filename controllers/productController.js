import Product from "../models/Product.js";

// Backend base URL (change if you deploy to another domain)
const BASE_URL = "https://ecommerce-backend-2-g9wx.onrender.com";

// GET /api/products → Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Ensure image has full URL
    const updatedProducts = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("/images")
        ? `${BASE_URL}${p.image}`
        : p.image,
    }));

    res.json(updatedProducts);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/:id → Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedProduct = {
      ...product._doc,
      image: product.image?.startsWith("/images")
        ? `${BASE_URL}${product.image}`
        : product.image,
    };

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products → Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    const newProduct = new Product({
      name,
      price,
      image, // store as /images/... or full URL
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(400).json({ message: "Invalid product data" });
  }
};

// DELETE /api/products/:id → Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      message: "Product deleted successfully",
      deletedId: product._id,
    });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};
