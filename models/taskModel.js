// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   dueDate: {
//     type: Date,
//   },
// });

// taskSchema.pre("save", async function (next) {
//   // Check if assignedTo is being updated
//   if (!this.isModified("assignedTo")) return next();

//   const newAssignedUserId = this.assignedTo;

//   // Check if the task is already assigned to another user
//   const existingTask = await Task.findById(this._id);
//   if (
//     existingTask &&
//     existingTask.assignedTo &&
//     existingTask.assignedTo.toString() !== newAssignedUserId.toString()
//   ) {
//     throw new Error("This task is already assigned to another user.");
//   }

//   next();
// });

// const Task = mongoose.model("Task", taskSchema);
// export default Task;

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dueDate: {
    type: Date,
  },
  departmentId: {
    // Reference to the department document
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

// Existing pre-save middleware for assignedTo (optional)

const Task = mongoose.model("Task", taskSchema);

export default Task;
