import express from "express";
const router = express.Router();

import {
  getTasks,
  getTaskById,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

// Get all tasks (Manager only)
router.get("/", getTasks);

// Get a specific task (Manager or assigned user)
router.get("/:id", protect, getTaskById);

// Get tasks of a specific user
router.get(
  "/:userId/tasks",
  //  protect,
  getUserTasks
);

// Create a new task (Manager only)
router.post("/", protect, authorize(["manager", "admin"]), createTask);

// Update a task (Manager or admin)
router.put(
  "/:id",
  // protect,
  // authorize(["manager", "admin"]),
  updateTask
);

// Delete a task (Manager only)
router.delete("/:id", protect, authorize(["manager", "admin"]), deleteTask);

export default router;
