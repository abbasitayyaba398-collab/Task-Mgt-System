// const Todo = require("../models/Todo");
// const Employee = require("../models/Employee");
// const { getIO } = require("../socket");
// const {
//   createNotification,
//   notifyStakeholders,
// } = require("./notificationController");

// // ======================================
// // SOCKET HELPERS
// // ======================================
// const emitToTasksRoom = (event, payload) => {
//   const io = getIO();
//   if (io) io.to("tasks_room").emit(event, payload);
// };

// const emitToTaskRoom = (todoId, event, payload) => {
//   const io = getIO();
//   if (io) io.to(`task_${todoId}`).emit(event, payload);
// };

// // ======================================
// // LOG HELPERS
// // ======================================
// const getActor = (source = {}) => ({
//   performedById: source.performedById || source.commentedById || "",
//   performedByName:
//     source.performedByName || source.commentedByName || "Someone",
//   performedByRole:
//     source.performedByRole || source.commentedByRole || source.role || "",
// });

// const pushLog = (todo, action, message, actor = {}) => {
//   todo.logs.push({
//     action,
//     message,
//     performedById: actor.performedById || "",
//     performedByName: actor.performedByName || "Someone",
//     performedByRole: actor.performedByRole || "",
//     createdAt: new Date(),
//   });
// };

// const resolveEmployeeName = async (employeeId) => {
//   if (!employeeId) return null;
//   try {
//     const employee = await Employee.findById(employeeId).select("name");
//     return employee ? employee.name : "Unknown Employee";
//   } catch (err) {
//     return "Unknown Employee";
//   }
// };

// const normalizeAssignedToArray = (value) => {
//   if (value === undefined) return undefined;
//   if (value === null) return [];

//   const arr = Array.isArray(value) ? value : [value];

//   return arr.filter((v) => v !== null && v !== undefined && v !== "");
// };

// const resolveEmployeeNames = async (employeeIds = []) => {
//   if (!employeeIds || employeeIds.length === 0) return "no one";

//   const names = await Promise.all(
//     employeeIds.map((id) => resolveEmployeeName(id))
//   );

//   return names.filter(Boolean).join(", ") || "no one";
// };

// const sameAssignedTo = (a = [], b = []) => {
//   const setA = new Set(a.map(String));
//   const setB = new Set(b.map(String));

//   if (setA.size !== setB.size) return false;

//   for (const id of setA) {
//     if (!setB.has(id)) return false;
//   }

//   return true;
// };

// // ======================================
// // Old aur new assignedTo compare kar ke logs banata hai,
// // aur naye assign hue employees ko LIVE (bina DB save)
// // notification bhejta hai socket ke through.
// // ======================================
// const logAssignmentChange = async (todo, previousIds = [], nextIds = [], actor) => {
//   const previousSet = new Set(previousIds.map(String));
//   const nextSet = new Set(nextIds.map(String));

//   const addedIds = nextIds.filter((id) => !previousSet.has(String(id)));
//   const removedIds = previousIds.filter((id) => !nextSet.has(String(id)));

//   if (addedIds.length > 0) {
//     const allCurrentNames = await resolveEmployeeNames(nextIds);
//     pushLog(todo, "assigned", `Task assigned to ${allCurrentNames}`, actor);

//     // ==========================
//     // Notify newly-assigned employees
//     // Ab yeh DB mein save hoti hai (history) aur sath hi socket
//     // ke through live bhi emit hoti hai.
//     // ==========================
//     addedIds.forEach((employeeId) => {
//       createNotification({
//         recipientId: employeeId,
//         message: `You have been assigned a new task: "${todo.title}"`,
//         type: "assigned",
//         todoId: todo._id,
//       });
//     });
//   }

//   if (removedIds.length > 0) {
//     const removedNames = await resolveEmployeeNames(removedIds);
//     pushLog(todo, "unassigned", `Task removed from ${removedNames}`, actor);
//   }

//   return addedIds.length > 0 || removedIds.length > 0;
// };

// // ======================================
// // GET ALL TODOS
// // ======================================
// const getTodos = async (req, res) => {
//   try {
//     const { role, userId } = req.query;

//     let todos;

//     if (role === "admin") {
//       todos = await Todo.find()
//         .populate("assignedTo", "name")
//         .populate("createdBy", "name username")
//         .sort({ createdAt: -1 });
//     } else {
//       todos = await Todo.find({
//         assignedTo: userId,
//       })
//         .populate("assignedTo", "name")
//         .populate("createdBy", "name username")
//         .sort({ createdAt: -1 });
//     }

//     res.status(200).json(todos);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch todos",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // GET TODO BY ID
// // ======================================
// const getTodoById = async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id)
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch todo",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // CREATE TODO
// // ======================================
// const createTodo = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       createdBy,
//       performedById,
//       performedByName,
//       performedByRole,
//     } = req.body;

//     if (!title || title.trim() === "") {
//       return res.status(400).json({
//         message: "Title is required",
//       });
//     }

//     const todo = await Todo.create({
//       title,
//       description,
//       status: "Pending",
//       assignedTo: [],
//       createdBy,
//     });

//     const actor = getActor({
//       performedById: performedById || createdBy,
//       performedByName,
//       performedByRole: performedByRole || "admin",
//     });

//     pushLog(todo, "created", `Task "${title}" was created`, actor);

//     await todo.save();

//     const newTodo = await Todo.findById(todo._id)
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     emitToTasksRoom("task:created", newTodo);

//     res.status(201).json(newTodo);
//   } catch (error) {
//     res.status(400).json({
//       message: "Failed to create todo",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // ASSIGN USER TO TASK
// // ======================================
// const assignTodo = async (req, res) => {
//   try {
//     const {
//       assignedTo,
//       performedById,
//       performedByName,
//       performedByRole,
//     } = req.body;

//     const existingTodo = await Todo.findById(req.params.id);

//     if (!existingTodo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     const previousAssignedTo = (existingTodo.assignedTo || []).map(String);
//     const nextAssignedTo = (normalizeAssignedToArray(assignedTo) || []).map(
//       String
//     );

//     const todo = await Todo.findByIdAndUpdate(
//       req.params.id,
//       {
//         assignedTo: nextAssignedTo,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     )
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     if (!sameAssignedTo(previousAssignedTo, nextAssignedTo)) {
//       const actor = getActor({
//         performedById,
//         performedByName,
//         performedByRole,
//       });

//       const changed = await logAssignmentChange(
//         todo,
//         previousAssignedTo,
//         nextAssignedTo,
//         actor
//       );

//       if (changed) {
//         await todo.save();
//       }
//     }

//     emitToTasksRoom("task:updated", todo);
//     emitToTaskRoom(todo._id, "task:updated", todo);

//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to assign task",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // UPDATE STATUS
// // ======================================
// const updateStatus = async (req, res) => {
//   try {
//     const {
//       status,
//       performedById,
//       performedByName,
//       performedByRole,
//     } = req.body;

//     const existingTodo = await Todo.findById(req.params.id).select(
//       "status"
//     );

//     if (!existingTodo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     const previousStatus = existingTodo.status;

//     const todo = await Todo.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     )
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     if (previousStatus !== status) {
//       const actor = getActor({
//         performedById,
//         performedByName,
//         performedByRole,
//       });

//       pushLog(
//         todo,
//         "status_changed",
//         `Status changed from "${previousStatus}" to "${status}"`,
//         actor
//       );

//       await todo.save();

//       notifyStakeholders({
//         todo,
//         actorId: actor.performedById,
//         message: `Status of task "${todo.title}" changed to "${status}"`,
//         type: "status_changed",
//       });
//     }

//     emitToTasksRoom("task:updated", todo);
//     emitToTaskRoom(todo._id, "task:updated", todo);

//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update status",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // UPDATE TODO
// // ======================================
// const updateTodo = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       status,
//       assignedTo,
//       performedById,
//       performedByName,
//       performedByRole,
//       ...rest
//     } = req.body;

//     const existingTodo = await Todo.findById(req.params.id);

//     if (!existingTodo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     const updateFields = { ...rest };
//     if (title !== undefined) updateFields.title = title;
//     if (description !== undefined) updateFields.description = description;
//     if (status !== undefined) updateFields.status = status;

//     const nextAssignedTo = normalizeAssignedToArray(assignedTo);
//     if (nextAssignedTo !== undefined) {
//       updateFields.assignedTo = nextAssignedTo;
//     }

//     const todo = await Todo.findByIdAndUpdate(
//       req.params.id,
//       updateFields,
//       {
//         new: true,
//         runValidators: true,
//       }
//     )
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     const actor = getActor({
//       performedById,
//       performedByName,
//       performedByRole,
//     });

//     let logsAdded = false;

//     if (title !== undefined && title !== existingTodo.title) {
//       pushLog(
//         todo,
//         "title_updated",
//         `Title changed from "${existingTodo.title}" to "${title}"`,
//         actor
//       );
//       logsAdded = true;
//     }

//     if (
//       description !== undefined &&
//       description !== existingTodo.description
//     ) {
//       pushLog(todo, "description_updated", "Description was updated", actor);
//       logsAdded = true;
//     }

//     if (status !== undefined && status !== existingTodo.status) {
//       pushLog(
//         todo,
//         "status_changed",
//         `Status changed from "${existingTodo.status}" to "${status}"`,
//         actor
//       );
//       logsAdded = true;

//       notifyStakeholders({
//         todo,
//         actorId: actor.performedById,
//         message: `Status of task "${todo.title}" changed to "${status}"`,
//         type: "status_changed",
//       });
//     }

//     if (nextAssignedTo !== undefined) {
//       const previousAssignedToIds = (existingTodo.assignedTo || []).map(
//         String
//       );
//       const nextAssignedToIds = nextAssignedTo.map(String);

//       if (!sameAssignedTo(previousAssignedToIds, nextAssignedToIds)) {
//         const changed = await logAssignmentChange(
//           todo,
//           previousAssignedToIds,
//           nextAssignedToIds,
//           actor
//         );

//         if (changed) {
//           logsAdded = true;
//         }
//       }
//     }

//     if (logsAdded) {
//       await todo.save();
//     }

//     emitToTasksRoom("task:updated", todo);
//     emitToTaskRoom(todo._id, "task:updated", todo);

//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(400).json({
//       message: "Failed to update todo",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // DELETE TODO
// // ======================================
// const deleteTodo = async (req, res) => {
//   try {
//     const todo = await Todo.findByIdAndDelete(req.params.id);

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     emitToTasksRoom("task:deleted", { _id: todo._id });
//     emitToTaskRoom(todo._id, "task:deleted", { _id: todo._id });

//     res.status(200).json({
//       message: "Todo deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete todo",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // ADD COMMENT
// // ======================================
// const addComment = async (req, res) => {
//   try {
//     const { text, commentedById, commentedByName, commentedByRole } =
//       req.body;

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         message: "Comment text is required",
//       });
//     }

//     const todo = await Todo.findById(req.params.id);

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     todo.comments.push({
//       text: text.trim(),
//       commentedById,
//       commentedByName,
//       commentedByRole,
//       createdAt: new Date(),
//     });

//     pushLog(
//       todo,
//       "comment_added",
//       `${commentedByName || "Someone"} added a comment`,
//       getActor({ commentedById, commentedByName, commentedByRole })
//     );

//     await todo.save();

//     const updatedTodo = await Todo.findById(todo._id)
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
//     emitToTasksRoom("task:updated", updatedTodo);

//     notifyStakeholders({
//       todo: updatedTodo,
//       actorId: commentedById,
//       message: `${commentedByName || "Someone"} commented on task "${
//         updatedTodo.title
//       }"`,
//       type: "comment_added",
//     });

//     res.status(200).json(updatedTodo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to add comment",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // UPDATE COMMENT
// // ======================================
// const updateComment = async (req, res) => {
//   try {
//     const { text, role, performedById, performedByName } = req.body;

//     if (role !== "admin") {
//       return res.status(403).json({
//         message: "Only an admin can edit comments",
//       });
//     }

//     const todo = await Todo.findById(req.params.id);

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     const comment = todo.comments.id(req.params.commentId);

//     if (!comment) {
//       return res.status(404).json({
//         message: "Comment not found",
//       });
//     }

//     comment.text = text;

//     pushLog(
//       todo,
//       "comment_updated",
//       `${performedByName || "Admin"} edited a comment`,
//       getActor({ performedById, performedByName, performedByRole: role })
//     );

//     await todo.save();

//     const updatedTodo = await Todo.findById(todo._id)
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
//     emitToTasksRoom("task:updated", updatedTodo);

//     res.status(200).json(updatedTodo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update comment",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // DELETE COMMENT
// // ======================================
// const deleteComment = async (req, res) => {
//   try {
//     const { role, performedById, performedByName } = req.query;

//     if (role !== "admin") {
//       return res.status(403).json({
//         message: "Only an admin can delete comments",
//       });
//     }

//     const todo = await Todo.findById(req.params.id);

//     if (!todo) {
//       return res.status(404).json({
//         message: "Todo not found",
//       });
//     }

//     todo.comments.pull(req.params.commentId);

//     pushLog(
//       todo,
//       "comment_deleted",
//       `${performedByName || "Admin"} deleted a comment`,
//       getActor({ performedById, performedByName, performedByRole: role })
//     );

//     await todo.save();

//     const updatedTodo = await Todo.findById(todo._id)
//       .populate("assignedTo", "name")
//       .populate("createdBy", "name username");

//     emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
//     emitToTasksRoom("task:updated", updatedTodo);

//     res.status(200).json(updatedTodo);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete comment",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getTodos,
//   getTodoById,
//   createTodo,
//   assignTodo,
//   updateStatus,
//   updateTodo,
//   deleteTodo,
//   addComment,
//   updateComment,
//   deleteComment,
// };



const Todo = require("../models/Todo");
const Employee = require("../models/Employee");
const { getIO } = require("../socket");
const {
  createNotification,
  notifyStakeholders,
} = require("./notificationController");

// ======================================
// SOCKET HELPERS
// ======================================
const emitToTasksRoom = (event, payload) => {
  const io = getIO();
  if (io) io.to("tasks_room").emit(event, payload);
};

const emitToTaskRoom = (todoId, event, payload) => {
  const io = getIO();
  if (io) io.to(`task_${todoId}`).emit(event, payload);
};

// ======================================
// LOG HELPERS
// ======================================
const getActor = (source = {}) => ({
  performedById: source.performedById || source.commentedById || "",
  performedByName:
    source.performedByName || source.commentedByName || "Someone",
  performedByRole:
    source.performedByRole || source.commentedByRole || source.role || "",
});

const pushLog = (todo, action, message, actor = {}) => {
  todo.logs.push({
    action,
    message,
    performedById: actor.performedById || "",
    performedByName: actor.performedByName || "Someone",
    performedByRole: actor.performedByRole || "",
    createdAt: new Date(),
  });
};

const resolveEmployeeName = async (employeeId) => {
  if (!employeeId) return null;
  try {
    const employee = await Employee.findById(employeeId).select("name");
    return employee ? employee.name : "Unknown Employee";
  } catch (err) {
    return "Unknown Employee";
  }
};

const normalizeAssignedToArray = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return [];

  const arr = Array.isArray(value) ? value : [value];

  return arr.filter((v) => v !== null && v !== undefined && v !== "");
};

const resolveEmployeeNames = async (employeeIds = []) => {
  if (!employeeIds || employeeIds.length === 0) return "no one";

  const names = await Promise.all(
    employeeIds.map((id) => resolveEmployeeName(id))
  );

  return names.filter(Boolean).join(", ") || "no one";
};

const sameAssignedTo = (a = [], b = []) => {
  const setA = new Set(a.map(String));
  const setB = new Set(b.map(String));

  if (setA.size !== setB.size) return false;

  for (const id of setA) {
    if (!setB.has(id)) return false;
  }

  return true;
};

// ======================================
// Old aur new assignedTo compare kar ke logs banata hai,
// aur naye assign hue employees ko LIVE (bina DB save)
// notification bhejta hai socket ke through.
// ======================================
const logAssignmentChange = async (todo, previousIds = [], nextIds = [], actor) => {
  const previousSet = new Set(previousIds.map(String));
  const nextSet = new Set(nextIds.map(String));

  const addedIds = nextIds.filter((id) => !previousSet.has(String(id)));
  const removedIds = previousIds.filter((id) => !nextSet.has(String(id)));

  if (addedIds.length > 0) {
    const allCurrentNames = await resolveEmployeeNames(nextIds);
    pushLog(todo, "assigned", `Task assigned to ${allCurrentNames}`, actor);

    // ==========================
    // Notify newly-assigned employees
    // Ab yeh DB mein save hoti hai (history) aur sath hi socket
    // ke through live bhi emit hoti hai.
    // ==========================
    addedIds.forEach((employeeId) => {
      createNotification({
        recipientId: employeeId,
        message: `You have been assigned a new task: "${todo.title}"`,
        type: "assigned",
        todoId: todo._id,
      });
    });

    // ==========================
    // Admins ko bhi is assignment ki notification/history milni
    // chahiye (pehle sirf naye assigned employee ko milti thi,
    // admin ki apni bell hamesha khali reh jaati thi — yahi wo
    // "admin side pe history save nahi ho rahi" wala masla tha).
    // ==========================
    const admins = await Employee.find({ role: "admin" }).select("_id");
    admins.forEach((admin) => {
      createNotification({
        recipientId: admin._id,
        message: `Task "${todo.title}" assigned to ${allCurrentNames}`,
        type: "assigned",
        todoId: todo._id,
      });
    });
  }

  if (removedIds.length > 0) {
    const removedNames = await resolveEmployeeNames(removedIds);
    pushLog(todo, "unassigned", `Task removed from ${removedNames}`, actor);
  }

  return addedIds.length > 0 || removedIds.length > 0;
};

// ======================================
// GET ALL TODOS
// ======================================
const getTodos = async (req, res) => {
  try {
    const { role, userId } = req.query;

    let todos;

    if (role === "admin") {
      todos = await Todo.find()
        .populate("assignedTo", "name")
        .populate("createdBy", "name username")
        .sort({ createdAt: -1 });
    } else {
      todos = await Todo.find({
        assignedTo: userId,
      })
        .populate("assignedTo", "name")
        .populate("createdBy", "name username")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
};

// ======================================
// GET TODO BY ID
// ======================================
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todo",
      error: error.message,
    });
  }
};

// ======================================
// CREATE TODO
// ======================================
const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      createdBy,
      deadline,
      performedById,
      performedByName,
      performedByRole,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    // Agar user ne file attach ki hai to Multer usay
    // req.file mein de deta hai (upload middleware ne
    // already disk par save kar diya hota hai).
    const attachment = req.file
      ? {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          url: `/uploads/${req.file.filename}`,
        }
      : null;

    const todo = await Todo.create({
      title,
      description,
      status: "Pending",
      assignedTo: [],
      createdBy,
      deadline: deadline || null,
      attachment,
    });

    const actor = getActor({
      performedById: performedById || createdBy,
      performedByName,
      performedByRole: performedByRole || "admin",
    });

    pushLog(todo, "created", `Task "${title}" was created`, actor);

    await todo.save();

    const newTodo = await Todo.findById(todo._id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    emitToTasksRoom("task:created", newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create todo",
      error: error.message,
    });
  }
};

// ======================================
// ASSIGN USER TO TASK
// ======================================
const assignTodo = async (req, res) => {
  try {
    const {
      assignedTo,
      performedById,
      performedByName,
      performedByRole,
    } = req.body;

    const existingTodo = await Todo.findById(req.params.id);

    if (!existingTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const previousAssignedTo = (existingTodo.assignedTo || []).map(String);
    const nextAssignedTo = (normalizeAssignedToArray(assignedTo) || []).map(
      String
    );

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: nextAssignedTo,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (!sameAssignedTo(previousAssignedTo, nextAssignedTo)) {
      const actor = getActor({
        performedById,
        performedByName,
        performedByRole,
      });

      const changed = await logAssignmentChange(
        todo,
        previousAssignedTo,
        nextAssignedTo,
        actor
      );

      if (changed) {
        await todo.save();
      }
    }

    emitToTasksRoom("task:updated", todo);
    emitToTaskRoom(todo._id, "task:updated", todo);

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign task",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE STATUS
// ======================================
const updateStatus = async (req, res) => {
  try {
    const {
      status,
      performedById,
      performedByName,
      performedByRole,
    } = req.body;

    const existingTodo = await Todo.findById(req.params.id).select(
      "status"
    );

    if (!existingTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const previousStatus = existingTodo.status;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (previousStatus !== status) {
      const actor = getActor({
        performedById,
        performedByName,
        performedByRole,
      });

      pushLog(
        todo,
        "status_changed",
        `Status changed from "${previousStatus}" to "${status}"`,
        actor
      );

      await todo.save();

      notifyStakeholders({
        todo,
        actorId: actor.performedById,
        message: `Status of task "${todo.title}" changed to "${status}"`,
        type: "status_changed",
      });
    }

    emitToTasksRoom("task:updated", todo);
    emitToTaskRoom(todo._id, "task:updated", todo);

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE TODO
// ======================================
const updateTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      assignedTo,
      performedById,
      performedByName,
      performedByRole,
      ...rest
    } = req.body;

    const existingTodo = await Todo.findById(req.params.id);

    if (!existingTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const updateFields = { ...rest };
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;

    const nextAssignedTo = normalizeAssignedToArray(assignedTo);
    if (nextAssignedTo !== undefined) {
      updateFields.assignedTo = nextAssignedTo;
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const actor = getActor({
      performedById,
      performedByName,
      performedByRole,
    });

    let logsAdded = false;

    if (title !== undefined && title !== existingTodo.title) {
      pushLog(
        todo,
        "title_updated",
        `Title changed from "${existingTodo.title}" to "${title}"`,
        actor
      );
      logsAdded = true;
    }

    if (
      description !== undefined &&
      description !== existingTodo.description
    ) {
      pushLog(todo, "description_updated", "Description was updated", actor);
      logsAdded = true;
    }

    if (status !== undefined && status !== existingTodo.status) {
      pushLog(
        todo,
        "status_changed",
        `Status changed from "${existingTodo.status}" to "${status}"`,
        actor
      );
      logsAdded = true;

      notifyStakeholders({
        todo,
        actorId: actor.performedById,
        message: `Status of task "${todo.title}" changed to "${status}"`,
        type: "status_changed",
      });
    }

    if (nextAssignedTo !== undefined) {
      const previousAssignedToIds = (existingTodo.assignedTo || []).map(
        String
      );
      const nextAssignedToIds = nextAssignedTo.map(String);

      if (!sameAssignedTo(previousAssignedToIds, nextAssignedToIds)) {
        const changed = await logAssignmentChange(
          todo,
          previousAssignedToIds,
          nextAssignedToIds,
          actor
        );

        if (changed) {
          logsAdded = true;
        }
      }
    }

    if (logsAdded) {
      await todo.save();
    }

    emitToTasksRoom("task:updated", todo);
    emitToTaskRoom(todo._id, "task:updated", todo);

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update todo",
      error: error.message,
    });
  }
};

// ======================================
// DELETE TODO
// ======================================
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    emitToTasksRoom("task:deleted", { _id: todo._id });
    emitToTaskRoom(todo._id, "task:deleted", { _id: todo._id });

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete todo",
      error: error.message,
    });
  }
};

// ======================================
// ADD COMMENT
// ======================================
const addComment = async (req, res) => {
  try {
    const { text, commentedById, commentedByName, commentedByRole } =
      req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    todo.comments.push({
      text: text.trim(),
      commentedById,
      commentedByName,
      commentedByRole,
      createdAt: new Date(),
    });

    pushLog(
      todo,
      "comment_added",
      `${commentedByName || "Someone"} added a comment`,
      getActor({ commentedById, commentedByName, commentedByRole })
    );

    await todo.save();

    const updatedTodo = await Todo.findById(todo._id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
    emitToTasksRoom("task:updated", updatedTodo);

    notifyStakeholders({
      todo: updatedTodo,
      actorId: commentedById,
      message: `${commentedByName || "Someone"} commented on task "${
        updatedTodo.title
      }"`,
      type: "comment_added",
    });

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE COMMENT
// ======================================
const updateComment = async (req, res) => {
  try {
    const { text, role, performedById, performedByName } = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only an admin can edit comments",
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const comment = todo.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.text = text;

    pushLog(
      todo,
      "comment_updated",
      `${performedByName || "Admin"} edited a comment`,
      getActor({ performedById, performedByName, performedByRole: role })
    );

    await todo.save();

    const updatedTodo = await Todo.findById(todo._id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
    emitToTasksRoom("task:updated", updatedTodo);

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment",
      error: error.message,
    });
  }
};

// ======================================
// DELETE COMMENT
// ======================================
const deleteComment = async (req, res) => {
  try {
    const { role, performedById, performedByName } = req.query;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only an admin can delete comments",
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    todo.comments.pull(req.params.commentId);

    pushLog(
      todo,
      "comment_deleted",
      `${performedByName || "Admin"} deleted a comment`,
      getActor({ performedById, performedByName, performedByRole: role })
    );

    await todo.save();

    const updatedTodo = await Todo.findById(todo._id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name username");

    emitToTaskRoom(updatedTodo._id, "task:updated", updatedTodo);
    emitToTasksRoom("task:updated", updatedTodo);

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  assignTodo,
  updateStatus,
  updateTodo,
  deleteTodo,
  addComment,
  updateComment,
  deleteComment,
};