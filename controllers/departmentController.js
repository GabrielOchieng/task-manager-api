import asyncHandler from "express-async-handler";
import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Get all departments
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate("users");
  res.status(200).json(departments);
});

const getDepartmentTasks = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const tasks = await Task.find({ departmentId }); // Filter by departmentId

  res.status(200).json(tasks);
});

const getDepartmentDetails = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(departmentId) }, // Filter by department ID
      },
      {
        $lookup: {
          from: "users", // Foreign collection (User)
          localField: "users", // Local field referencing user IDs
          foreignField: "_id", // Foreign field (User model's ID)
          as: "users", // Alias for the joined user data
        },
      },
      {
        $lookup: {
          from: "tasks", // Foreign collection (Task)
          localField: "_id", // Local field referencing department ID
          foreignField: "departmentId", // Foreign field (Task model's department ID)
          as: "tasks", // Alias for the joined task data
        },
      },
      {
        $project: {
          _id: 1,
          name: 1, // Department fields
          description: 1,
          users: 1, // Joined user data
          tasks: 1, // Joined task data
        },
      },
    ]);

    if (!department.length) {
      res.status(404);
      throw new Error("Department not found");
    }

    res.status(200).json(department[0]); // Assuming single department per request
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }); // Generic error response
  }
});

// // Get department by ID
// const getDepartmentById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const department = await Department.findById(id).populate("users"); // Optional: populate users

//   if (!department) {
//     res.status(404);
//     throw new Error("Department not found");
//   }

//   res.status(200).json(department);
// });

const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id).populate("users"); // Optional: populate users

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create department
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, users = [] } = req.body; // Allow optional user IDs

  // Validate data (e.g., required fields)

  const department = await Department.create({
    name,
    description,
    users, // Include user IDs in creation if provided
  });

  res.status(201).json(department);
});

// Update department
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, users = [] } = req.body; // Allow optional user IDs for update

  // Validate data and ID

  const department = await Department.findByIdAndUpdate(
    id,
    { name, users }, // Update users array if provided
    { new: true }
  );

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json(department);
});

// Delete department
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findByIdAndDelete(id);

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json({ message: "Department deleted successfully" });
});

// Add user to department (assuming user ID provided in request body)
const addUserToDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { userId } = req.body;

  // Validate IDs

  const department = await Department.findById(departmentId);

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  // Check if user already exists in department (optional)

  department.users.push(userId);

  await department.save();

  res.status(200).json(department);
});

// Remove user from department
const removeUserFromDepartment = asyncHandler(async (req, res) => {
  const { departmentId, userId } = req.params;

  // Validate IDs

  const department = await Department.findById(departmentId);

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  department.users.pull(userId);

  await department.save();

  res.status(200).json(department);
});

export {
  getDepartments,
  getDepartmentById,
  getDepartmentTasks,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addUserToDepartment,
  removeUserFromDepartment,
  // getDepartmentDetails,
};
