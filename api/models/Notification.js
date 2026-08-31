// backend/models/Notification.js
//
// Har notification ab yahan DB mein save hoti hai taake bell icon
// ki history persist rahe (sirf live/session tak mehdood na ho,
// login/logout aur page refresh ke baad bhi dikhti rahe).
//
// recipient hamesha "Employee" collection ka _id hota hai — kyunke
// admin aur employee dono isi collection se login karte hain
// (dekho controllers/loginController.js).

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Kis wajah se notification bani — bell dropdown mein
    // future mein icon/filter ke liye kaam aa sakta hai.
    type: {
      type: String,
      enum: ["assigned", "status_changed", "comment_added"],
      required: true,
    },

    todo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);