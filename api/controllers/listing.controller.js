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

export const getlistings =async(req,res,next)=>{
 try {
  const limit =parseInt (req.query.limit)||9
  const startIndex=parseInt(req.query.startIndex)||0
  let offer= req.query.offer;
  if(offer===undefined||'false'){
    offer={$in:[false,true ]}
  }
  // if (offer === undefined || offer === 'false') {
  //   offer = { $in: [false, true] };
  // } else if (offer === 'true') {
  //   offer = true;
  // }

  let furnished=req.query.furnished;
  // if(furnished===undefined||'false'){
  //   furnished={$in:[false,true ]}
  // }
  if (furnished === undefined || furnished === 'false') {
    furnished = { $in: [false, true] };
} else if (furnished === 'true') {
    furnished = true;
}


  let parking=req.query.parking;
  if(parking===undefined||'false'){
    parking={$in:[false,true ]}
  }

  let type=req.query.type;
  if(type===undefined||type==='all'){
    type={$in:['sale','rent']}
  }

  const searchTerm=req.query.searchTerm||'';
  const sort=req.query.sort||'createdAt';
  const order=req.query.order||'desc';

  const listings=await Listing.find({
    name:{$regex:searchTerm,$options:'i'},
    offer,
    furnished,
    parking,
    type
  }).sort({
    [sort]:order
  }).limit(limit).skip(startIndex)

  return res.status(200).json(listings);

 } catch (error) {
  next(error)
 } 
}

// export const getlistings = async (req, res, next) => {
//   try {
//       const limit = parseInt(req.query.limit) || 9;
//       const startIndex = parseInt(req.query.startIndex) || 0;

//       let offer = req.query.offer;
//       offer = offer === 'true' ? true : offer === 'false' ? false : { $in: [false, true] };

//       let furnished = req.query.furnished;
//       furnished = furnished === 'true' ? true : furnished === 'false' ? false : { $in: [false, true] };

//       let parking = req.query.parking;
//       parking = parking === 'true' ? true : parking === 'false' ? false : { $in: [false, true] };

//       let type = req.query.type;
//       type = type === 'all' ? { $in: ['sale', 'rent'] } : type;

//       const searchTerm = req.query.searchTerm || '';
      
//       const sortField = req.query.sort === 'created_at' ? 'createdAt' : 'regularPrice';
//       const order = req.query.order === 'asc' ? 1 : -1;

//       const listings = await Listing.find({
//           name: { $regex: searchTerm, $options: 'i' },
//           offer,
//           furnished,
//           parking,
//           type,
//       })
//       .sort({ [sortField]: order })
//       .limit(limit)
//       .skip(startIndex);

//       return res.status(200).json(listings);
//   } catch (error) {
//       next(error);
//   }
// };
