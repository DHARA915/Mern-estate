import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import mongoose from "mongoose";
import bcrypt from "bcryptjs" 
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
    console.log("test is working")

}

export const updateProfile = async (req, res) => {
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

    // ✅ Ensure email remains unchanged
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
};

export const  deleteUser=async(req,res,next)=>{
  try{
    const userId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // return res.status(400).json({ error: "You can only delete you account" });
      return next(errorHandler(401,"You can only delete your account"))
    }
    const user = await User.findById(userId)
    if(!user){
      // return res.status(404).json({error:"User not found"})
      return next(errorHandler(404,"User Not Found"))
      

    }
    await User.findByIdAndDelete(userId)
    // res.status(200).json({message:"Account deleted sucessfully!"})
    return next(errorHandler(200,"Account deleted sucessfully!"))
  }
  
  catch(error){
   console.error("Error in deleting account:",error)
   res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getUserListing = async (req, res, next) => {
  if (req.user.id.toString() === req.params.id.toString()) {
    try {
      const listings = await Listing.find({ useRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};





