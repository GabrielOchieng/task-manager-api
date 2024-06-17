// import asyncHandler from "express-async-handler";
// import Department from "../models/departmentModel.js";
// import User from "../models/userModel.js";

// // Get all departments (Manager only)
// const getDepartments = asyncHandler(async (req, res) => {
//   const departments = await Department.find().populate("users"); // Populate employee details
//   res.status(200).json(departments);
// });

// // Get a specific department by ID (Manager only)
// const getDepartmentById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const department = await Department.findById(id).populate("users");

//   if (!department) {
//     res.status(404).json({ message: "Department not found" });
//     return;
//   }

//   res.status(200).json(department);
// });

// // Create a new department (Manager only)
// const createDepartment = asyncHandler(async (req, res) => {
//   const { name, users } = req.body;

//   if (!name) {
//     res.status(400).json({ message: "Please add a department name" });
//     return;
//   }

//   const department = await Department.create({
//     name,
//     users,
//   });

//   // Update user documents with the newly created department ID
//   const updatePromises = users.map(async (userId) => {
//     return User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { departments: department._id } },
//       { new: true }
//     ); // Update user and return updated doc
//   });

//   const updatedUsers = await Promise.all(updatePromises);

//   // Update the department document with the actual assigned users (optional)
//   department.users = updatedUsers.map((user) => user._id);
//   await department.save(); // Save department with updated users array (optional)

//   res.status(201).json(department, updatedUsers);
// });

// // Update a department by ID (Manager only)
// const updateDepartment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, users } = req.body;

//   const department = await Department.findById(id);

//   if (!department) {
//     res.status(404).json({ message: "Department not found" });
//     return;
//   }

//   const updatedDepartment = await Department.findByIdAndUpdate(
//     id,
//     { name, users },
//     { new: true }
//   );

//   res.status(200).json(updatedDepartment);
// });

// // Delete a department by ID (Manager only)
// const deleteDepartment = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const department = await Department.findById(id);

//   if (!department) {
//     res.status(404).json({ message: "Department not found" });
//     return;
//   }

//   await department.remove();

//   res.status(200).json({ message: "Department deleted" });
// });

// // Add an employee to a department (Manager only)
// const addUserToDepartment = asyncHandler(async (req, res) => {
//   const { departmentId, userId } = req.body;

//   const department = await Department.findById(departmentId);

//   if (!department) {
//     res.status(404).json({ message: "Department not found" });
//     return;
//   }

//   const user = await User.findById(userId); // Assuming User model exists

//   if (!user) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }

//   if (department.users.includes(userId)) {
//     res
//       .status(400)
//       .json({ message: "User already belongs to this department" });
//     return;
//   }

//   department.users.push(userId);
//   await department.save();

//   res.status(200).json({ message: "Employee added to department" });
// });

// // Remove an employee from a department (Manager only)
// const removeUserFromDepartment = asyncHandler(async (req, res) => {
//   const { departmentId, userId } = req.body;

//   const department = await Department.findById(departmentId);

//   if (!department) {
//     res.status(404).json({ message: "Department not found" });
//     return;
//   }

//   const userIndex = department.users.indexOf(userId);

//   if (userIndex === -1) {
//     res.status(400).json({ message: "User not found in this department" });
//     return;
//   }

//   department.users.splice(userIndex, 1);
//   await department.save();

//   res.status(200).json({ message: "Employee removed from department" });
// });

// export {
//   getDepartments,
//   getDepartmentById,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
//   addUserToDepartment,
//   removeUserFromDepartment,
// };

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
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" }); // Generic error response
  }
});

// Get department by ID
const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id).populate("users"); // Optional: populate users

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json(department);
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
  const { name, description, users = [] } = req.body; // Allow optional user IDs for update

  // Validate data and ID

  const department = await Department.findByIdAndUpdate(
    id,
    { name, description, users }, // Update users array if provided
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
