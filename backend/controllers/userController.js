



// backend/controllers/userController.js

const User = require("../models/User");

// ======================================
// GET ALL NORMAL USERS
// Used in Assign To dropdown
// ======================================
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("_id username email role")
      .sort({ username: 1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ======================================
// GET USER BY ID
// GET /api/users/:id
// ======================================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
};