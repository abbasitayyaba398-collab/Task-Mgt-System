
 



// // backend/models/Employee.js

// const mongoose = require("mongoose");

// const employeeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Employee name is required"],
//       trim: true,
//     },

//     username: {
//       type: String,
//       required: [true, "Username is required"],
//       trim: true,
//       unique: true, // Duplicate usernames se bachne ke liye
//     },

//     contactNumber: {
//       type: String,
//       required: [true, "Contact number is required"],
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       trim: true,
//       lowercase: true,
//       unique: true, // Duplicate emails se bachne ke liye
//     },

//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },

//     cnic: {
//       type: String,
//       required: [true, "CNIC is required"],
//       trim: true,
//       unique: true, // Duplicate CNIC se bachne ke liye
//     },

//     dob: {
//       type: Date,
//       required: true,
//     },

//     address: {
//       type: String,
//       required: [true, "Employee Address is required"],
//       trim: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     comments: [
//       {
//         text: String,
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         role: String,
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true, // Single source of truth for Created Date & Updated Date
//   }
// );

// module.exports = mongoose.model("Employee", employeeSchema);








// backend/models/Employee.js

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true, // Duplicate usernames se bachne ke liye
    },

    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true, // Duplicate emails se bachne ke liye
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    cnic: {
      type: String,
      required: [true, "CNIC is required"],
      trim: true,
      unique: true, // Duplicate CNIC se bachne ke liye
    },

    dob: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      required: [true, "Employee Address is required"],
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByName: {
      type: String,
    },

    comments: [
      {
        text: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Single source of truth for Created Date & Updated Date
  }
);

module.exports = mongoose.model("Employee", employeeSchema);