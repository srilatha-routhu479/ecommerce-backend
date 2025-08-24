import Order from "../models/Order.js";

// ✅ Create Order (only COD or basic order creation)
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      shippingAddress,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order Creation Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get My Orders (user-specific)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("products.productId", "name price image") // ✅ added image
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // show user info
      .populate("products.productId", "name price image") // ✅ added image
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ message: "Server error while fetching all orders" });
  }
};

// ✅ Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.orderStatus;
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};
