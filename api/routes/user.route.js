import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/user.model.js';

const router = express.Router();

router.put("/update/:id", protect, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Validate email before allowing updates
    if (email !== user.email) {
      return res.status(403).json({ error: "Unauthorized: Email does not match." });
    }

    let updateFields = {};
    if (username) {
      updateFields.username = username;
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No changes detected to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
