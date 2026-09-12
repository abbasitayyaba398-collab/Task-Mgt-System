// backend/routes/loginRoutes.js

const express = require("express");
const router = express.Router();

// Import Login Controller
const { loginUser } = require("../controllers/loginController");

// Login Route
router.post("/", loginUser);

module.exports = router;