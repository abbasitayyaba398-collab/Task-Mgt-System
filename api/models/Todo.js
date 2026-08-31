


// backend/models/Todo.js

const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Rejected", "Approved"],
      default: "Pending",
    },

    // Task ki deadline — date aur time dono (JS Date object
    // dono ko sath store karta hai).
    deadline: {
      type: Date,
      default: null,
    },

    // Task ke sath attach ki gayi file (agar koi ho) —
    // asli file "uploads/" folder mein disk par save hoti hai,
    // yahan sirf uska record rakha jata hai.
    attachment: {
      type: {
        fileName: { type: String },      // disk par saved naam
        originalName: { type: String },  // user ne jo naam upload kiya
        url: { type: String },           // "/uploads/<fileName>"
      },
      default: null,
    },

    // Multiple employees ko ek task assign ho sakta hai
    assignedTo: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },
      ],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // ==============================
    // Comments
    // Commenter can be an Admin (User collection)
    // or an Employee (Employee collection), so we
    // store the name/role directly instead of a
    // single ref to avoid cross-collection issues.
    // ==============================
    comments: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },

        commentedById: {
          type: String, // Admin's or Employee's _id as string
        },

        commentedByName: {
          type: String,
        },

        commentedByRole: {
          type: String, // "admin" | "employee"
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==============================
    // Activity Logs
    // Har task ke andar uski apni history
    // store hoti hai: create, edit, status
    // change, assign, comments waghera.
    // ==============================
    logs: [
      {
        action: {
          type: String,
          enum: [
            "created",
            "title_updated",
            "description_updated",
            "status_changed",
            "assigned",
            "reassigned",
            "unassigned",
            "comment_added",
            "comment_updated",
            "comment_deleted",
          ],
          required: true,
        },

        message: {
          type: String,
          required: true,
        },

        performedById: {
          type: String, // Admin's or Employee's _id as string
        },

        performedByName: {
          type: String,
        },

        performedByRole: {
          type: String, // "admin" | "employee"
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);