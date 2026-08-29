// backend/socket.js
//
// Socket.IO singleton. server.js isse initialize karta hai (init),
// aur controllers isse import kar ke events emit karte hain (getIO).
//
// Rooms:
//   - "tasks_room"      -> sab logged-in users (task list + task view
//                          live update ke liye)
//   - `task_<todoId>`   -> sirf jo abhi us specific task ko dekh rahe
//                          hain (TaskView page par) — comments/logs
//                          live update ke liye
//   - `user_<employeeId>` -> sirf us employee ke liye (personal
//                          notifications — jaise "task assigned to you")
// ==============================================================

let io = null;

const init = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    // Har connected client "tasks_room" me hota hai taake
    // task list / task view real-time update ho sake.
    socket.join("tasks_room");

    // Client apna userId bhej kar personal notification room
    // join karta hai.
    socket.on("join", ({ userId } = {}) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Employee/Admin jab TaskView page kholta hai, us specific
    // task ka room join kar leta hai — is se sirf usi task ke
    // comments/logs update is client tak pohanchte hain.
    socket.on("task:join", (todoId) => {
      if (todoId) {
        socket.join(`task_${todoId}`);
      }
    });

    socket.on("task:leave", (todoId) => {
      if (todoId) {
        socket.leave(`task_${todoId}`);
      }
    });

    socket.on("disconnect", () => {
      // socket.io khud hi rooms se remove kar deta hai
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { init, getIO };