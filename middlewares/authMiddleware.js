import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify JWT token (replace with your secret key)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object for further use
    req.user = await User.findById(decoded._id);

    // User is authorized, continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (allowedRoles) => (req, res, next) => {
  const user = req.user; // Assuming user object is attached to request after login
  if (allowedRoles.includes(user.role)) {
    next(); // User has allowed role, proceed
  } else {
    res.status(403).json({ message: "Unauthorized access" }); // User doesn't have permission
  }
};

export { protect, authorize };
