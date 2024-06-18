import express from "express";
import {
  loginUser,
  registerUser,
  logOutUser,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);

// Get all users (protected, accessible only by authorized users)
router.get("/", protect, authorize(["admin", "manager"]), getAllUsers);

// Delete user (protected, accessible only by authorized users)
router.delete("/:id", protect, authorize(["admin", "manager"]), deleteUser);

// Edit user (protected, accessible only by authorized users)
router.put("/:id", protect, authorize(["admin", "manager"]), updateUser);

export default router;
