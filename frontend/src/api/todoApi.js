







// const BASE_URL = "http://localhost:5000/api/todos";

// // ======================================
// // GET TODOS
// // ======================================
// export const fetchTodos = async (user) => {
//   const response = await fetch(
//     `${BASE_URL}?role=${user.role}&userId=${user._id || user.id}`
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch todos");
//   }

//   return await response.json();
// };

// // ======================================
// // GET TASK BY ID
// // ======================================
// export const fetchTaskById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch task");
//   }

//   return await response.json();
// };

// // ======================================
// // CREATE TODO
// // ======================================
// export const createTodo = async (todo) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(todo),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to create task");
//   }

//   return await response.json();
// };

// // ======================================
// // UPDATE TODO
// // ======================================
// export const updateTodo = async (id, updatedData) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedData),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to update task");
//   }

//   return await response.json();
// };

// // ======================================
// // UPDATE STATUS
// // ======================================
// export const updateStatus = async (id, status) => {
//   const response = await fetch(`${BASE_URL}/${id}/status`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ status }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to update status");
//   }

//   return await response.json();
// };

// // ======================================
// // ASSIGN USER
// // `performedBy` (optional) = { performedById, performedByName, performedByRole }
// // Isse task ke andar "Assigned by ..." log ban sakta hai.
// // ======================================
// export const assignTodo = async (todoId, userId, performedBy = {}) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/assign`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       assignedTo: userId,
//       ...performedBy,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to assign task");
//   }

//   return await response.json();
// };

// // ======================================
// // DELETE TODO
// // ======================================
// export const deleteTodo = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to delete task");
//   }

//   return await response.json();
// };

// // ======================================
// // ADD COMMENT
// // ======================================
// export const addTaskComment = async (todoId, commentData) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/comments`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(commentData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to add comment");
//   }

//   return data;
// };

// // ======================================
// // UPDATE COMMENT
// // ======================================
// export const updateTaskComment = async (
//   todoId,
//   commentId,
//   commentData
// ) => {
//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(commentData),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update comment");
//   }

//   return data;
// };

// // ======================================
// // DELETE COMMENT
// // ======================================
// export const deleteTaskComment = async (
//   todoId,
//   commentId,
//   role,
//   performedById = "",
//   performedByName = ""
// ) => {
//   const params = new URLSearchParams({
//     role: role || "",
//     performedById,
//     performedByName,
//   });

//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}?${params.toString()}`,
//     {
//       method: "DELETE",
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to delete comment");
//   }

//   return data;
// };




// const BASE_URL = "http://localhost:5000/api/todos";

// // ======================================
// // GET TODOS
// // ======================================
// export const fetchTodos = async (user) => {
//   const response = await fetch(
//     `${BASE_URL}?role=${user.role}&userId=${user._id || user.id}`
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch todos");
//   }

//   return await response.json();
// };

// // ======================================
// // GET TASK BY ID
// // ======================================
// export const fetchTaskById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch task");
//   }

//   return await response.json();
// };

// // ======================================
// // CREATE TODO
// // ======================================
// export const createTodo = async (todo) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(todo),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.error || "Failed to create task");
//   }

//   return data;
// };

// // ======================================
// // UPDATE TODO
// // ======================================
// export const updateTodo = async (id, updatedData) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.error || "Failed to update task");
//   }

//   return data;
// };

// // ======================================
// // UPDATE STATUS
// // ======================================
// export const updateStatus = async (id, status) => {
//   const response = await fetch(`${BASE_URL}/${id}/status`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ status }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.error || "Failed to update status");
//   }

//   return data;
// };

// // ======================================
// // ASSIGN USER
// // `performedBy` (optional) = { performedById, performedByName, performedByRole }
// // Isse task ke andar "Assigned by ..." log ban sakta hai.
// // ======================================
// export const assignTodo = async (todoId, userId, performedBy = {}) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/assign`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       assignedTo: userId,
//       ...performedBy,
//     }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.error || "Failed to assign task");
//   }

//   return data;
// };

// // ======================================
// // DELETE TODO
// // ======================================
// export const deleteTodo = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || data.error || "Failed to delete task");
//   }

//   return data;
// };

// // ======================================
// // ADD COMMENT
// // ======================================
// export const addTaskComment = async (todoId, commentData) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/comments`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(commentData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to add comment");
//   }

//   return data;
// };

// // ======================================
// // UPDATE COMMENT
// // ======================================
// export const updateTaskComment = async (
//   todoId,
//   commentId,
//   commentData
// ) => {
//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(commentData),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update comment");
//   }

//   return data;
// };

// // ======================================
// // DELETE COMMENT
// // ======================================
// export const deleteTaskComment = async (
//   todoId,
//   commentId,
//   role,
//   performedById = "",
//   performedByName = ""
// ) => {
//   const params = new URLSearchParams({
//     role: role || "",
//     performedById,
//     performedByName,
//   });

//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}?${params.toString()}`,
//     {
//       method: "DELETE",
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to delete comment");
//   }

//   return data;
// };





// const BASE_URL = "http://localhost:5000/api/todos";

// // ======================================
// // GET TODOS
// // ======================================
// export const fetchTodos = async (user) => {
//   const response = await fetch(
//     `${BASE_URL}?role=${user.role}&userId=${user._id || user.id}`
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch todos");
//   }

//   return await response.json();
// };

// // ======================================
// // GET TASK BY ID
// // ======================================
// export const fetchTaskById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch task");
//   }

//   return await response.json();
// };

// // ======================================
// // CREATE TODO
// // ======================================
// export const createTodo = async (todo) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(todo),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     // data.error = asli Mongoose/validation error (zyada useful)
//     // data.message = generic wrapper text
//     throw new Error(data.error || data.message || "Failed to create task");
//   }

//   return data;
// };

// // ======================================
// // UPDATE TODO
// // ======================================
// export const updateTodo = async (id, updatedData) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     // data.error = asli Mongoose/validation error (zyada useful)
//     // data.message = generic wrapper text
//     throw new Error(data.error || data.message || "Failed to update task");
//   }

//   return data;
// };

// // ======================================
// // UPDATE STATUS
// // ======================================
// export const updateStatus = async (id, status) => {
//   const response = await fetch(`${BASE_URL}/${id}/status`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ status }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     // data.error = asli Mongoose/validation error (zyada useful)
//     // data.message = generic wrapper text
//     throw new Error(data.error || data.message || "Failed to update status");
//   }

//   return data;
// };

// // ======================================
// // ASSIGN USER
// // `performedBy` (optional) = { performedById, performedByName, performedByRole }
// // Isse task ke andar "Assigned by ..." log ban sakta hai.
// // ======================================
// export const assignTodo = async (todoId, userId, performedBy = {}) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/assign`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       assignedTo: userId,
//       ...performedBy,
//     }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     // data.error = asli Mongoose/validation error (zyada useful)
//     // data.message = generic wrapper text
//     throw new Error(data.error || data.message || "Failed to assign task");
//   }

//   return data;
// };

// // ======================================
// // DELETE TODO
// // ======================================
// export const deleteTodo = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     // data.error = asli Mongoose/validation error (zyada useful)
//     // data.message = generic wrapper text
//     throw new Error(data.error || data.message || "Failed to delete task");
//   }

//   return data;
// };

// // ======================================
// // ADD COMMENT
// // ======================================
// export const addTaskComment = async (todoId, commentData) => {
//   const response = await fetch(`${BASE_URL}/${todoId}/comments`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(commentData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.error || data.message || "Failed to add comment");
//   }

//   return data;
// };

// // ======================================
// // UPDATE COMMENT
// // ======================================
// export const updateTaskComment = async (
//   todoId,
//   commentId,
//   commentData
// ) => {
//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(commentData),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.error || data.message || "Failed to update comment");
//   }

//   return data;
// };

// // ======================================
// // DELETE COMMENT
// // ======================================
// export const deleteTaskComment = async (
//   todoId,
//   commentId,
//   role,
//   performedById = "",
//   performedByName = ""
// ) => {
//   const params = new URLSearchParams({
//     role: role || "",
//     performedById,
//     performedByName,
//   });

//   const response = await fetch(
//     `${BASE_URL}/${todoId}/comments/${commentId}?${params.toString()}`,
//     {
//       method: "DELETE",
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.error || data.message || "Failed to delete comment");
//   }

//   return data;
// };





const BASE_URL = "http://localhost:5000/api/todos";

// Attachment files "/uploads/..." se serve hoti hain (server
// root se, "/api/todos" wale prefix ke bina) — TaskView/TodoList
// mein download link banane ke kaam aata hai.
export const FILE_BASE_URL = BASE_URL.replace("/api/todos", "");

// ======================================
// GET TODOS
// ======================================
export const fetchTodos = async (user) => {
  const response = await fetch(
    `${BASE_URL}?role=${user.role}&userId=${user._id || user.id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return await response.json();
};

// ======================================
// GET TASK BY ID
// ======================================
export const fetchTaskById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return await response.json();
};

// ======================================
// CREATE TODO
//
// `todo` ab ya to plain object ho sakta hai, ya FormData
// (jab file attachment ke sath bheja jaye). FormData ke case
// mein "Content-Type" header khud set NAHI karte — browser
// khud sahi multipart boundary set kar deta hai.
// ======================================
export const createTodo = async (todo) => {
  const isFormData = todo instanceof FormData;

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: isFormData
      ? undefined
      : { "Content-Type": "application/json" },
    body: isFormData ? todo : JSON.stringify(todo),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.error = asli Mongoose/validation error (zyada useful)
    // data.message = generic wrapper text
    throw new Error(data.error || data.message || "Failed to create task");
  }

  return data;
};

// ======================================
// UPDATE TODO
// ======================================
export const updateTodo = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.error = asli Mongoose/validation error (zyada useful)
    // data.message = generic wrapper text
    throw new Error(data.error || data.message || "Failed to update task");
  }

  return data;
};

// ======================================
// UPDATE STATUS
// ======================================
export const updateStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.error = asli Mongoose/validation error (zyada useful)
    // data.message = generic wrapper text
    throw new Error(data.error || data.message || "Failed to update status");
  }

  return data;
};

// ======================================
// ASSIGN USER
// `performedBy` (optional) = { performedById, performedByName, performedByRole }
// Isse task ke andar "Assigned by ..." log ban sakta hai.
// ======================================
export const assignTodo = async (todoId, userId, performedBy = {}) => {
  const response = await fetch(`${BASE_URL}/${todoId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assignedTo: userId,
      ...performedBy,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // data.error = asli Mongoose/validation error (zyada useful)
    // data.message = generic wrapper text
    throw new Error(data.error || data.message || "Failed to assign task");
  }

  return data;
};

// ======================================
// DELETE TODO
// ======================================
export const deleteTodo = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    // data.error = asli Mongoose/validation error (zyada useful)
    // data.message = generic wrapper text
    throw new Error(data.error || data.message || "Failed to delete task");
  }

  return data;
};

// ======================================
// ADD COMMENT
// ======================================
export const addTaskComment = async (todoId, commentData) => {
  const response = await fetch(`${BASE_URL}/${todoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to add comment");
  }

  return data;
};

// ======================================
// UPDATE COMMENT
// ======================================
export const updateTaskComment = async (
  todoId,
  commentId,
  commentData
) => {
  const response = await fetch(
    `${BASE_URL}/${todoId}/comments/${commentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to update comment");
  }

  return data;
};

// ======================================
// DELETE COMMENT
// ======================================
export const deleteTaskComment = async (
  todoId,
  commentId,
  role,
  performedById = "",
  performedByName = ""
) => {
  const params = new URLSearchParams({
    role: role || "",
    performedById,
    performedByName,
  });

  const response = await fetch(
    `${BASE_URL}/${todoId}/comments/${commentId}?${params.toString()}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to delete comment");
  }

  return data;
};