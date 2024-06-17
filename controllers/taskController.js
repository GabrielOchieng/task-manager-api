import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

// Get all tasks (Manager only)
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).populate("assignedTo"); // Populate assigned user details
  res.status(200).json(tasks);
});

// Get a specific task (Manager or assigned user)
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("assignedTo");

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json(task);
});

const getUserTasks = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("tasks"); // Populate tasks data
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.tasks); // Return user's tasks
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: "Failed to fetch user tasks" });
  }
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  // Validate title
  if (!title) {
    return res.status(400).json({ message: "Please add a title" });
  }

  try {
    // Create the task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
    });

    // Update assigned user's tasks
    await User.findByIdAndUpdate(assignedTo, {
      $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
    });

    // Task created successfully
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    // Handle specific errors or return a generic error message
    return res.status(500).json({ message: "Failed to create task" });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, assignedTo, dueDate, completed } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (task) {
      task.title = title || task.title; // Update name if provided (or keep existing)
      task.description = description || task.description; // Update email if provided (or keep existing)
      task.assignedTo = assignedTo || task.assignedTo; // Update role if provided (or keep existing)
      task.dueDate = dueDate || task.dueDate; // Update role if provided (or keep existing)
      task.completed = completed || task.completed; // Update role if provided (or keep existing)

      // Update assigned user's tasks
      await User.findByIdAndUpdate(assignedTo, {
        $push: { tasks: task._id }, // Push the task's ObjectId to user's tasks
      });

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

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTask = await Task.findByIdAndDelete(id);

  if (!deletedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  // Update user's tasks array (if applicable)
  if (deletedTask.assignedTo) {
    await User.findByIdAndUpdate(deletedTask.assignedTo, {
      $pull: { tasks: deletedTask._id },
    });
  }

  res.status(200).json({ message: "Task deleted" });
});

// Function to fetch tasks due within a certain timeframe (e.g., next 7 days)
const getUpcomingTasks = async (days) => {
  const today = new Date();
  const dueDateThreshold = new Date(today.setDate(today.getDate() + days));
  const upcomingTasks = await Task.find({
    dueDate: { $lte: dueDateThreshold }, // Find tasks due before or on the threshold date
  });
  return upcomingTasks;
};

export {
  getTasks,
  getTaskById,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
};
