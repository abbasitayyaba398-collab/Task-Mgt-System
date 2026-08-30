

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateStatus,
  assignTodo,
  deleteTodo,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/todoController");

// ======================================
// GET ALL TODOS
// ======================================
router.get("/", getTodos);

// ======================================
// GET TODO BY ID
// ======================================
router.get("/:id", getTodoById);

// ======================================
// CREATE TODO
// "attachment" field name se file aati hai (agar user
// ne koi file select ki ho — optional hai).
// ======================================
router.post("/", upload.single("attachment"), createTodo);

// ======================================
// UPDATE COMPLETE TODO
// ======================================
router.put("/:id", updateTodo);

// ======================================
// UPDATE STATUS ONLY
// ======================================
router.patch("/:id/status", updateStatus);

// ======================================
// ASSIGN USER
// ======================================
router.patch("/:id/assign", assignTodo);

// ======================================
// DELETE TODO
// ======================================
router.delete("/:id", deleteTodo);

// ======================================
// COMMENTS
// ======================================
router.post("/:id/comments", addComment);
router.put("/:id/comments/:commentId", updateComment);
router.delete("/:id/comments/:commentId", deleteComment);

module.exports = router;