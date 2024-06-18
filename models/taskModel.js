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
