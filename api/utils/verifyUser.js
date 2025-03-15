import jwt from  'jsonwebtoken'

import { errorHandler } from "../utils/error.js";

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    console.log("🔍 Checking Cookies in Middleware:", req.cookies); // Check if cookies exist
    console.log("🔍 Extracted Token:", req.cookies.access_token); // Check extracted token

    if(!token){
        return next(errorHandler(401,'Unauthorized'))
    }
    
    jwt.verify(token ,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'))
        req.user=user;
        console.log(req.user)
    next()   
    })


}

