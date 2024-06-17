// import asyncHandler from "express-async-handler";
// import Task from "../models/taskModel.js";
// import User from "../models/userModel.js";

// // Get all tasks (Manager only)
// const getTasks = asyncHandler(async (req, res) => {
//   const tasks = await Task.find({}).populate("assignedTo"); // Populate assigned user details
//   res.status(200).json(tasks);
// });

// // Get a specific task (Manager or assigned user)
// const getTaskById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const task = await Task.findById(id).populate("assignedTo");

//   if (!task) {
//     res.status(404).json({ message: "Task not found" });
//     return;
//   }

//   res.status(200).json(task);
// });

// const getUserTasks = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const user = await User.findById(userId).populate("tasks"); // Populate tasks data
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user.tasks); // Return user's tasks
//   } catch (error) {
//     console.error("Error fetching user tasks:", error);
//     res.status(500).json({ message: "Failed to fetch user tasks" });
//   }
// };

// const createTask = asyncHandler(async (req, res) => {
//   const { title, description, assignedTo, dueDate } = req.body;

//   // Validate title
//   if (!title) {
//     return res.status(400).json({ message: "Please add a title" });
//   }

//   try {
//     // Create the task
//     const task = await Task.create({
//       title,
//       description,
//       assignedTo,
//       dueDate,
//     });

//     // Update assigned user's tasks
//     await User.findByIdAndUpdate(assignedTo, {
//       $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
//     });

//     // Task created successfully
//     res.status(201).json(task);
//   } catch (error) {
//     console.error("Error creating task:", error);
//     // Handle specific errors or return a generic error message
//     return res.status(500).json({ message: "Failed to create task" });
//   }
// });

// const updateTask = asyncHandler(async (req, res) => {
//   const taskId = req.params.id;
//   const { title, description, assignedTo, dueDate, completed } = req.body;

//   try {
//     const task = await Task.findById(taskId);

//     if (task) {
//       task.title = title || task.title; // Update name if provided (or keep existing)
//       task.description = description || task.description; // Update email if provided (or keep existing)
//       task.assignedTo = assignedTo || task.assignedTo; // Update role if provided (or keep existing)
//       task.dueDate = dueDate || task.dueDate; // Update role if provided (or keep existing)
//       task.completed = completed || task.completed; // Update role if provided (or keep existing)

//       // Update assigned user's tasks
//       await User.findByIdAndUpdate(assignedTo, {
//         $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
//       });

//       const updatedTask = await task.save();
//       res.status(200).json(updatedTask);
//     } else {
//       res.status(404);
//       throw new Error("Task not found");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// const deleteTask = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const deletedTask = await Task.findByIdAndDelete(id);

//   if (!deletedTask) {
//     res.status(404).json({ message: "Task not found" });
//     return;
//   }

//   // Update user's tasks array (if applicable)
//   if (deletedTask.assignedTo) {
//     await User.findByIdAndUpdate(deletedTask.assignedTo, {
//       $pull: { tasks: deletedTask._id },
//     });
//   }

//   res.status(200).json({ message: "Task deleted" });
// });

// // Function to fetch tasks due within a certain timeframe (e.g., next 7 days)
// const getUpcomingTasks = async (days) => {
//   const today = new Date();
//   const dueDateThreshold = new Date(today.setDate(today.getDate() + days));
//   const upcomingTasks = await Task.find({
//     dueDate: { $lte: dueDateThreshold }, // Find tasks due before or on the threshold date
//   });
//   return upcomingTasks;
// };

// export {
//   getTasks,
//   getTaskById,
//   getUserTasks,
//   createTask,
//   updateTask,
//   deleteTask,
//   getUpcomingTasks,
// };

import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

// Get all tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("assignedTo").populate("createdBy"); // Optional: populate users
  res.status(200).json(tasks);
});

// Get task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("assignedTo")
    .populate("createdBy"); // Optional: populate users

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
});

// Get user tasks
const getUserTasks = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tasks = await Task.find({ assignedTo: userId }).populate("assignedTo"); // Optional: populate assignedTo user

  res.status(200).json(tasks);
});

// Get department tasks
const getDepartmentTasks = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const tasks = await Task.find({ departmentId }); // Filter by departmentId

  res.status(200).json(tasks);
});

// Create task
const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, assignedTo, createdBy, dueDate, departmentId } =
      req.body;

    // Validate data (e.g., required fields)

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy,
      dueDate,
      departmentId,
    });

    // Update assigned user's tasks
    await User.findByIdAndUpdate(assignedTo, {
      $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    // Handle specific errors or return a generic error message
    return res.status(500).json({ message: "Failed to create task" });
  }
});

// Update task
// const updateTask = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { title, description, assignedTo, createdBy, dueDate, departmentId } =
//     req.body;

//   // Validate data and ID

//   const task = await Task.findByIdAndUpdate(
//     id,
//     { title, description, assignedTo, createdBy, dueDate, departmentId },
//     { new: true }
//   );

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   res.status(200).json(task);
// });

// const updateTask = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { title, description, assignedTo, dueDate, departmentId } = req.body;

//   console.log(
//     "INCOMING",
//     title,
//     description,
//     assignedTo,
//     dueDate,
//     departmentId
//   );

//   // Validate data and ID (assuming validation logic exists elsewhere)

//   try {
//     const updatedTask = await Task.findByIdAndUpdate(
//       id,
//       { $set: { title, description, assignedTo, dueDate, departmentId } },
//       { new: true } // Ensure we return the updated document
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     // Update tasks for previous and new assigned users (if changed)
//     const previousAssignedTo = updatedTask.assignedTo; // Store original assignedTo

//     if (assignedTo && assignedTo !== previousAssignedTo) {
//       // Update previous assigned user's tasks (remove task ID)
//       await User.findByIdAndUpdate(previousAssignedTo, {
//         $pull: { tasks: updatedTask._id }, // Remove task ID from previous user's tasks
//       });

//       // Update new assigned user's tasks (push task ID)
//       await User.findByIdAndUpdate(assignedTo, {
//         $push: { tasks: updatedTask._id }, // Push task ID to new user's tasks
//       });
//     }

//     // Update tasks for previous and new departments (if changed)
//     const previousDepartmentId = updatedTask.departmentId; // Store original departmentId

//     if (departmentId && departmentId !== previousDepartmentId) {
//       // Logic to update previous and new department tasks (implementation details depend on your setup)

//       // Example (assuming a 'Departments' collection and tasks have a 'department' field):
//       // 1. Update previous department tasks (remove task ID)
//       await Department.findByIdAndUpdate(previousDepartmentId, {
//         $pull: { tasks: updatedTask._id }, // Remove task ID from previous department's tasks
//       });

//       // 2. Update new department tasks (push task ID)
//       await Department.findByIdAndUpdate(departmentId, {
//         $push: { tasks: updatedTask._id }, // Push task ID to new department's tasks
//       });
//     }

//     res.status(200).json(updatedTask);
//     console.log(updatedTask);
//   } catch (error) {
//     console.error("Error updating task:", error);
//     res.status(500).json({ message: "Error updating task" });
//   }
// });

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, assignedTo, dueDate, departmentId, completed } =
    req.body;

  try {
    const task = await Task.findById(taskId);

    if (task) {
      task.title = title || task.title; // Update name if provided (or keep existing)
      task.description = description || task.description; // Update email if provided (or keep existing)
      task.assignedTo = assignedTo || task.assignedTo; // Update role if provided (or keep existing)
      task.dueDate = dueDate || task.dueDate; // Update role if provided (or keep existing)
      task.completed = completed || task.completed; // Update role if provided (or keep existing)
      task.departmentId = departmentId || task.departmentId;

      // // Update assigned user's tasks
      // await User.findByIdAndUpdate(assignedTo, {
      //   $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
      // });

      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } else {
      res.status(404);
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json({ message: "Task deleted successfully" });
});

// Get upcoming tasks (optional date range)
const getUpcomingTasks = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query; // Optional query parameters

  let query = {};
  if (startDate && endDate) {
    query = { dueDate: { $gte: startDate, $lt: endDate } };
  }

  const tasks = await Task.find(query);

  res.status(200).json(tasks);
});

export {
  getTasks,
  getTaskById,
  getUserTasks,
  getDepartmentTasks,
  createTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
};
