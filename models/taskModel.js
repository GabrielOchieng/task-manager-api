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
});

// taskSchema.pre("save", async function (next) {
//   // Check if assignedTo is being updated
//   if (!this.isModified("assignedTo")) return next();

//   const newAssignedUserId = this.assignedTo;

//   // Find existing task with this _id
//   const existingTask = await Task.findById(this._id);

//   // If existing task has an assigned user, remove it
//   if (existingTask && existingTask.assignedTo) {
//     existingTask.assignedTo = null;
//     await existingTask.save();
//   }

//   next();
// });

taskSchema.pre("save", async function (next) {
  // Check if assignedTo is being updated
  if (!this.isModified("assignedTo")) return next();

  const newAssignedUserId = this.assignedTo;

  // Check if the task is already assigned to another user
  const existingTask = await Task.findById(this._id);
  if (
    existingTask &&
    existingTask.assignedTo &&
    existingTask.assignedTo.toString() !== newAssignedUserId.toString()
  ) {
    throw new Error("This task is already assigned to another user.");
  }

  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
