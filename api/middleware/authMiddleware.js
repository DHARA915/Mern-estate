import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const protect = (req, res, next) => {
  let token;

  // Check if token exists in headers (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  // If no token in headers, check in cookies
  if (!token && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // console.log("🛠 Token received:", token); // Debugging log

  if (!token) {
    return next(errorHandler(401, "Not authorized, no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(403, "Invalid or expired token!"));
  }
};
