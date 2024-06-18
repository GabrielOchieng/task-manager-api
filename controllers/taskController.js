import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

// Get all tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo")
    .populate("departmentId"); // Optional: populate users
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

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, assignedTo, dueDate, departmentId, completed } =
    req.body;

  try {
    const task = await Task.findById(taskId);
    console.log("TASK", task);
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
      console.log("UPDATED", updatedTask);
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
