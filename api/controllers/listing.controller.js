import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

export const createlisting =async(req,res,next)=>{
try {
    const listing = await Listing.create(req.body)
    res.status(201).json({ success: true, _id: listing._id, listing });

} catch (error) {
    next(error)
}
}


export const deleteListing =async(req,res,next)=>{
 const listing = await Listing.findById(req.params.id);
 if(!listing){
    return next(errorHandler(404,"Listing not found!"))
 }
 if(req.user.id!==listing.useRef){
    return next(errorHandler(401,"You only delete your own listing!"))
 }
 try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!")
 } catch (error) {
    next(error)
 }
}


export const updateListing = async (req, res, next) => {
  const { id } = req.params;

  // ✅ Validate ID format before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid listing ID format!"));
  }

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return next(errorHandler(404, "Listing Not Found!"));
    }

    // ✅ Check if the current user is the owner of the listing
    if (req.user.id !== listing.useRef.toString()) {
      return next(errorHandler(401, "You can only update your own listing!"));
    }

    // ✅ Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);

  } catch (error) {
    console.error("Error updating listing:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getListing =async(req,res,next)=>{
  try {
    const listing=await Listing.findById(req.params.id);
    if(!listing){
      return next(errorHandler(404,'Listing Not found!'))

    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}