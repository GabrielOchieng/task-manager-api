// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // const roleSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //     enum: ["user", "manager", "admin"], // Allowed roles
// //   },
// // });

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     role: {
//       type: String,
//       enum: ["user", "manager", "admin"], // Allowed roles
//       default: "user", // Default role
//     },
//     password: {
//       type: String,
//       required: true,
//     },

//     tasks: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Task",
//       },
//     ],
//     department: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Department",
//       default: new mongoose.Types.ObjectId("666d2cc5916e4764ada9fdab"), // Replace with actual ObjectId
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Department from "./departmentModel.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"], // Allowed roles
      default: "user", // Default role
    },
    password: {
      type: String,
      required: true,
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isModified("department")) {
    return next(); // Skip if not password or department change
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // If department is being updated
  if (this.isModified("department")) {
    // Remove user from previous department (optional)
    if (this.department) {
      await Department.findByIdAndUpdate(this.department, {
        $pull: { users: this._id },
      });
    }
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
