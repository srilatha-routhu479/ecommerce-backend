import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ✅ Helper to build absolute image URL
const buildImageUrl = (req, rawUrl) => {
  if (!rawUrl) return null;
  const normalized = String(rawUrl).trim();
  const lower = normalized.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return normalized;
  }
  return `${req.protocol}://${req.get("host")}${normalized}`;
};

// ✅ Get Cart with product details
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId", "name price image");

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => {
      const product = item.productId
        ? {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.image
              ? buildImageUrl(req, item.productId.image)
              : null,
          }
        : null;

      return {
        _id: item._id,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        customText: item.customText || "",
        customImage: item.customImage
          ? buildImageUrl(req, item.customImage)
          : null,
        product,
      };
    });

    return res.json({ items: formattedItems });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = "", color = "" } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity, size, color }],
      });
    } else {
      const existingItem = cart.items.find(
        item =>
          item.productId &&
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size, color });
      }
    }

    await cart.save();
    res.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let item = cart.items.id(itemId);
    if (!item) {
      item = cart.items.find(
        (i) => i.productId && i.productId.toString() === String(itemId)
      );
    }
    if (!item) return res.status(404).json({ message: "Item not found" });

    const nextQty = Math.max(1, parseInt(quantity, 10) || 1);
    item.quantity = nextQty;
    await cart.save();

    res.json({ message: "Quantity updated", itemId: item._id, quantity: item.quantity });
  } catch (error) {
    console.error("❌ Error updating quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("❌ Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
