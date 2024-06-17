import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, department, tasks } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: "user",
    department,
    tasks,
  });

  if (user) {
    // Generate JWT token (replace with your secret key)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Set expiry time for the token (e.g., 1 day)
    });

    res.status(200).json({ token, user }); // Send back token and sanitized user info
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT token (replace with your secret key)
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Set expiry time for the token (e.g., 1 day)
  });

  res.status(200).json({ token, user }); // Send back token and sanitized user info
});

const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  console.log(user);

  res.status(200).json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
    console.log(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().populate("department"); // Populate with all department fields
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const editUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, department } = req.body; // Get specific fields to update, including departmentId
  console.log("Usercontrollerdept;", department);
  try {
    console.log("userid", userId);

    const user = await User.findById(userId);

    if (user) {
      // Update user fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.department = department || user.department;

      // // Update department if departmentId is provided
      // if (departmentId) {
      //   user.department = departmentId;
      // }

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get user ID from URL parameter

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export {
  loginUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  editUser,
  deleteUser,
};
