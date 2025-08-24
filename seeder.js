// seeder.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

// ✅ Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// ✅ Seed admin if not exists
const seedAdmin = async () => {
  await connectDB();

  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    console.log("⚠️ Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = new User({
    name: "Srivarun",
    email: "srilathav128@gmail.com",
    password: hashedPassword,
    role: "admin",
  });

  await adminUser.save();

  console.log("✅ Admin user created successfully");
  process.exit();
};


const resetAdminPassword = async () => {
  await connectDB();

  const newPassword = "srilatha123"; 
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await User.findOne({ email: "srilathav128@gmail.com" });
  if (!admin) {
    console.log("⚠️ Admin not found");
    process.exit();
  }

  admin.password = hashedPassword;
  await admin.save();

  console.log("✅ Admin password updated!");
  process.exit();
};


// seedAdmin();
resetAdminPassword();
