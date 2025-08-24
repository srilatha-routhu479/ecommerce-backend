import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        size: String,
        color: String,
        customText: String,
        customImage: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);