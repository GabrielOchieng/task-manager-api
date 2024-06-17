import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId).select("-password");

//       next();
//     } catch (error) {
//       res.status(401);
//       console.log(new Error("Not authorized"));
//       throw new Error("Not authorized, invalid token");
//     }
//   } else {
//     res.status(401);
//     console.log(new Error("Not authorized"));
//     throw new Error("Not authorized, no token");
//   }
// });

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   try {
//     console.log("req", req.cookies);
//     token = req.cookies.jwt;
//     console.log("token", token);
//     if (!token) {
//       throw new Error("Not authorized, no token");
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.userId).select("-password");

//     next();
//   } catch (error) {
//     console.error(error); // Log the error details
//     res.status(401).json({ message: "Not authorized" });
//   }
// });

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
    console.error(error);
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
