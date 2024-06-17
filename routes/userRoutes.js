// import express from "express";
// import {
//   loginUser,
//   registerUser,
//   logOutUser,
//   getUserProfile,
//   updateUserProfile,
//   getAllUsers,
// } from "../controllers/userController.js";
// import { authorize, protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logOutUser);
// router.get("/", getAllUsers);
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, authorize(["manager"]), updateUserProfile);

// export default router;

import express from "express";
import {
  loginUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  editUser,
} from "../controllers/userController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);

// Get all users (protected, accessible only by authorized users)
router.get("/", protect, authorize(["admin", "manager"]), getAllUsers);

// User profile routes (protected)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Delete user (protected, accessible only by authorized users)
router.delete("/:id", protect, authorize(["admin", "manager"]), deleteUser);

// Edit user (protected, accessible only by authorized users)
router.put("/:id", protect, authorize(["admin", "manager"]), editUser);

export default router;
