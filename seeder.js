// seeder.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

// ✅ Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// ✅ Products Data
const products = [
  { name: "Accessories 1", price: 999, image: "/images/accessories.jpg", category: "accessories" },
  { name: "Accessories 2", price: 1099, image: "/images/accessories2.jpg", category: "accessories" },
  { name: "Accessories 3", price: 1199, image: "/images/accessories3.jpg", category: "accessories" },
  { name: "Footwear 1", price: 1499, image: "/images/footwear1.jpg", category: "footwear" },
  { name: "Footwear 2", price: 1599, image: "/images/footwear2.jpg", category: "footwear" },
  { name: "Footwear 3", price: 1699, image: "/images/footwear3.jpg", category: "footwear" },
  { name: "Handbag 1", price: 1999, image: "/images/handbag1.jpg", category: "handbags" },
  { name: "Outfit 1", price: 1299, image: "/images/outfit1.jpg", category: "outfits" },
  { name: "Outfit 2", price: 1399, image: "/images/outfit2.jpg", category: "outfits" },
  { name: "Outfit 3", price: 1499, image: "/images/outfit3.jpg", category: "outfits" },
  { name: "Outfit 4", price: 1599, image: "/images/outfit4.jpg", category: "outfits" },
  { name: "Outfit 6", price: 1699, image: "/images/outfit6.jpg", category: "outfits" },
  { name: "Outfit 7", price: 1799, image: "/images/outfit7.jpg", category: "outfits" },
];

// ✅ Seed Function
const seedData = async () => {
  await connectDB();

  try {
    // 🔹 1. Remove old data
    await User.deleteMany();
    await Product.deleteMany();
    console.log("🗑️ Old users and products removed");

    // 🔹 2. Create admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const adminUser = new User({
      name: "Srivarun",
      email: "srilathav128@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    await adminUser.save();
    console.log("✅ Admin user created");

    // 🔹 3. Insert products
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    process.exit(1);
  }
};

seedData();
