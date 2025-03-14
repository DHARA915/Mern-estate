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

// import jwt from 'jsonwebtoken';
// import { errorHandler } from "../utils/error.js";

// export const verifyToken = (req, res, next) => {
//     console.log("🔍 Checking Cookies:", req.cookies);
//     console.log("🔍 Checking Headers:", req.headers);
//     console.log("🔍 Raw Cookie Header:", req.headers.cookie);
    
//     if (!req.cookies.access_token) {
//         console.log("❌ No token found in cookies!");
//         return res.status(401).json({ message: "Unauthorized! No token in cookies." });
//     }

//     jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.log("❌ Token verification failed:", err.message);
//             return res.status(403).json({ message: "Forbidden! Invalid token." });
//         }

//         console.log("✅ Token verified successfully:", user);
//         req.user = user;
//         next();
//     });
// };



