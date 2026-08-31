// const express = require("express");
// const router = express.Router();

// const { getUsers } = require("../controllers/userController");

// router.get("/", getUsers);

// module.exports = router;



// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
} = require("../controllers/userController");

// ======================================
// GET ALL USERS
// URL: /api/users
// ======================================
router.get("/", getUsers);

// ======================================
// GET USER BY ID
// URL: /api/users/:id
// ======================================
router.get("/:id", getUserById);

module.exports = router;