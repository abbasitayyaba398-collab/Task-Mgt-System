


// // backend/server.js

// // Load Environment Variables
// require("dotenv").config();

// // ==============================
// // Imports
// // ==============================
// const express = require("express");
// const cors = require("cors");
// const http = require("http");

// // Database
// const connectDB = require("./config/db");

// // Socket.IO
// const socket = require("./socket");

// // Routes
// const loginRoutes = require("./routes/loginRoutes");
// const todoRoutes = require("./routes/todoRoutes");
// const userRoutes = require("./routes/userRoutes");
// const employeeRoutes = require("./routes/employeeRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

// // ==============================
// // Connect Database
// // ==============================
// connectDB();

// // ==============================
// // Create Express App
// // ==============================
// const app = express();

// // Express app ko ek plain http server ke andar wrap karte hain
// // taake socket.io usi server par (same port) chal sake.
// const server = http.createServer(app);

// // Socket.IO initialize
// socket.init(server);

// // ==============================
// // Middleware
// // ==============================
// app.use(cors());
// app.use(express.json());

// // ==============================
// // Home Route
// // ==============================
// app.get("/", (req, res) => {
//   res.send("🚀 MERN Todo API Running...");
// });

// // ==============================
// // API Routes
// // ==============================

// // Login
// app.use("/api/login", loginRoutes);

// // Todos
// app.use("/api/todos", todoRoutes);

// // Users
// app.use("/api/users", userRoutes);

// // Employees
// app.use("/api/employees", employeeRoutes);

// // Notifications
// app.use("/api/notifications", notificationRoutes);

// // ==============================
// // 404 Route
// // ==============================
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route Not Found",
//   });
// });

// // ==============================
// // Start Server
// // (server.listen — NOT app.listen — kyunke socket.io usi
// // http server ke sath attached hai)
// // ==============================
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server Running On http://localhost:${PORT}`);
// });



// backend/server.js

// Load Environment Variables
require("dotenv").config();

// ==============================
// Imports
// ==============================
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

// Database
const connectDB = require("./config/db");

// Socket.IO
const socket = require("./socket");

// Routes
const loginRoutes = require("./routes/loginRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ==============================
// Connect Database
// ==============================
connectDB();

// ==============================
// Create Express App
// ==============================
const app = express();

// Express app ko ek plain http server ke andar wrap karte hain
// taake socket.io usi server par (same port) chal sake.
const server = http.createServer(app);

// Socket.IO initialize
socket.init(server);

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());

// Uploaded task attachments yahan se serve hoti hain
// (e.g. http://localhost:5000/uploads/<filename>)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Home Route
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 MERN Todo API Running...");
});

// ==============================
// API Routes
// ==============================

// Login
app.use("/api/login", loginRoutes);

// Todos
app.use("/api/todos", todoRoutes);

// Users
app.use("/api/users", userRoutes);

// Employees
app.use("/api/employees", employeeRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// ==============================
// 404 Route
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==============================
// Start Server
// (server.listen — NOT app.listen — kyunke socket.io usi
// http server ke sath attached hai)
// ==============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Running On http://localhost:${PORT}`);
});