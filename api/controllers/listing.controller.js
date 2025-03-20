import Listing from "../models/listing.model.js"


export const createlisting =async(req,res,next)=>{
try {
    const listing = await Listing.create(req.body)
    res.status(201).json({ success: true, _id: listing._id, listing });

} catch (error) {
    next(error)
}
}

// 