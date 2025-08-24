import Product from "../models/Product.js";

// GET /api/products → Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    
    const formatted = products.map((p) => ({
      ...p._doc,
      image: p.image || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      ...product._doc,
      image: product.image || null,
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products → Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    let { name, price, image } = req.body;

    // ✅ Validate base64 image format
    if (image && !image.startsWith("data:image")) {
      return res.status(400).json({
        message: "Image must be a valid base64 string (data:image/...;base64,xxx)",
      });
    }

    const newProduct = new Product(req.body);
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
