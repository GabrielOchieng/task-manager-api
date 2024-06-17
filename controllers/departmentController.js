import asyncHandler from "express-async-handler";
import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";

// Get all departments (Manager only)
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate("users"); // Populate employee details
  res.status(200).json(departments);
});

// Get a specific department by ID (Manager only)
const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id).populate("users");

  if (!department) {
    res.status(404).json({ message: "Department not found" });
    return;
  }

  res.status(200).json(department);
});

// Create a new department (Manager only)
const createDepartment = asyncHandler(async (req, res) => {
  const { name, users } = req.body;

  if (!name) {
    res.status(400).json({ message: "Please add a department name" });
    return;
  }

  const department = await Department.create({
    name,
    users,
  });

  // Update user documents with the newly created department ID
  const updatePromises = users.map(async (userId) => {
    return User.findByIdAndUpdate(
      userId,
      { $addToSet: { departments: department._id } },
      { new: true }
    ); // Update user and return updated doc
  });

  const updatedUsers = await Promise.all(updatePromises);

  // Update the department document with the actual assigned users (optional)
  department.users = updatedUsers.map((user) => user._id);
  await department.save(); // Save department with updated users array (optional)

  res.status(201).json(department, updatedUsers);
});

// const createDepartment = asyncHandler(async (req, res) => {
//   const { name, users } = req.body;

//   if (!name) {
//     res.status(400).json({ message: "Please add a department name" });
//     return;
//   }

//   try {
//     const department = await Department.create({

//       name,
//       users: [], // Initialize users as empty array to avoid overwriting existing data
//     });

//     // Update user documents with the newly created department ID
//     const updatePromises = users.map(async (userId) => {
//       return User.findByIdAndUpdate(
//         userId,
//         { $addToSet: { departments: department._id } },
//         { new: true }
//       ); // Update user and return updated doc
//     });

//     const updatedUsers = await Promise.all(updatePromises);

//     // Update the department document with the actual assigned users (optional)
//     department.users = updatedUsers.map((user) => user._id);
//     await department.save(); // Save department with updated users array (optional)

//     res.status(201).json({ department, updatedUsers }); // Send both department and updated users
//   } catch (error) {
//     console.error("Error creating department:", error);
//     res.status(500).json({ message: "Error creating department" });
//   }
// });

// Update a department by ID (Manager only)
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, users } = req.body;

  const department = await Department.findById(id);

  if (!department) {
    res.status(404).json({ message: "Department not found" });
    return;
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    { name, users },
    { new: true }
  );

  res.status(200).json(updatedDepartment);
});

// Delete a department by ID (Manager only)
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id);

  if (!department) {
    res.status(404).json({ message: "Department not found" });
    return;
  }

  await department.remove();

  res.status(200).json({ message: "Department deleted" });
});

// Add an employee to a department (Manager only)
const addUserToDepartment = asyncHandler(async (req, res) => {
  const { departmentId, userId } = req.body;

  const department = await Department.findById(departmentId);

  if (!department) {
    res.status(404).json({ message: "Department not found" });
    return;
  }

  const user = await User.findById(userId); // Assuming User model exists

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (department.users.includes(userId)) {
    res
      .status(400)
      .json({ message: "User already belongs to this department" });
    return;
  }

  department.users.push(userId);
  await department.save();

  res.status(200).json({ message: "Employee added to department" });
});

// Remove an employee from a department (Manager only)
const removeUserFromDepartment = asyncHandler(async (req, res) => {
  const { departmentId, userId } = req.body;

  const department = await Department.findById(departmentId);

  if (!department) {
    res.status(404).json({ message: "Department not found" });
    return;
  }

  const userIndex = department.users.indexOf(userId);

  if (userIndex === -1) {
    res.status(400).json({ message: "User not found in this department" });
    return;
  }

  department.users.splice(userIndex, 1);
  await department.save();

  res.status(200).json({ message: "Employee removed from department" });
});

export {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addUserToDepartment,
  removeUserFromDepartment,
};
