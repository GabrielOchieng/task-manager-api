import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure unique department names
  },
  description: {
    type: String,
  },
  users: [
    {
      // Optional embedded user IDs
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
    },
  ],
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
