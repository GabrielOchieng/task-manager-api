import express from "express";
const router = express.Router();

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addUserToDepartment,
  removeUserFromDepartment,
  getDepartmentTasks,
} from "../controllers/departmentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js"; // Assuming middleware is defined

// Get all departments (Manager and admin only)
router.get("/", protect, authorize(["manager", "admin"]), getDepartments);

// Get a specific department by ID (Manager only)
router.get(
  "/:id",
  // protect,
  //  authorize(["manager", "admin"]),
  getDepartmentById
);

router.get(
  "/:id/tasks",
  protect,
  authorize(["manager", "admin"]),
  getDepartmentTasks
);

// Create a new department (Manager only)
router.post("/", protect, authorize(["manager", "admin"]), createDepartment);

// Update a department by ID (Manager only)
router.put("/:id", protect, authorize(["manager", "admin"]), updateDepartment);

// Delete a department by ID (Manager only)
router.delete("/:id", protect, authorize(["manager"]), deleteDepartment);

// Add an employee to a department (Manager only)
router.put(
  "/:departmentId/employees",
  protect,
  authorize(["manager"]),
  addUserToDepartment
);

// Remove an employee from a department (Manager only)
router.put(
  "/:departmentId/employees/:employeeId",
  protect,
  authorize(["manager"]),
  removeUserFromDepartment
);

export default router;
