import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcrypt from "bcryptjs" 

export const test = (req, res) => {
    console.log("test is working")

}


export const updateProfile = async (req, res) => {
  console.log("🔹 Received Token User:", req.user);
  console.log("🔹 Request Body Email:", req.body.email);

  if (!req.body.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (req.user.email !== req.body.email) {
    return res.status(403).json({ message: "You can only update your own account" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

