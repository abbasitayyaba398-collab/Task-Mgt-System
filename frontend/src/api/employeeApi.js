// // frontend/src/api/employeeApi.js

// const BASE_URL = "http://localhost:5000/api/employees";

// // ======================================
// // GET ALL EMPLOYEES
// // ======================================
// export const fetchEmployees = async () => {
//   const response = await fetch(BASE_URL);

//   if (!response.ok) {
//     throw new Error("Failed to fetch employees");
//   }

//   return await response.json();
// };

// // ======================================
// // GET EMPLOYEE BY ID
// // ======================================
// export const fetchEmployeeById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch employee");
//   }

//   return await response.json();
// };

// // ======================================
// // CREATE EMPLOYEE
// // ======================================
// export const createEmployee = async (employee) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(employee),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to create employee");
//   }

//   return data;
// };

// // ======================================
// // UPDATE EMPLOYEE
// // ======================================
// export const updateEmployee = async (id, updatedData) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update employee");
//   }

//   return data;
// };

// // ======================================
// // DELETE EMPLOYEE
// // ======================================
// export const deleteEmployee = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to delete employee");
//   }

//   return await response.json();
// };



// const BASE_URL = "http://localhost:5000/api/employees";

// // ======================================
// // GET ALL EMPLOYEES
// // ======================================
// export const fetchEmployees = async () => {
//   const response = await fetch(BASE_URL);

//   if (!response.ok) {
//     throw new Error("Failed to fetch employees");
//   }

//   return await response.json();
// };

// // ======================================
// // GET EMPLOYEE BY ID
// // ======================================
// export const fetchEmployeeById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch employee");
//   }

//   return await response.json();
// };

// // ======================================
// // CREATE EMPLOYEE
// // ======================================
// export const createEmployee = async (employee) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(employee),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to create employee");
//   }

//   return data;
// };

// // ======================================
// // UPDATE EMPLOYEE
// // ======================================
// export const updateEmployee = async (id, employee) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(employee),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update employee");
//   }

//   return data;
// };

// // ======================================
// // DELETE EMPLOYEE
// // ======================================
// export const deleteEmployee = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to delete employee");
//   }

//   return data;
// };

// // // ======================================
// // // ADD COMMENT
// // // ======================================
// // export const addComment = async (employeeId, commentData) => {
// //   const response = await fetch(
// //     `${BASE_URL}/${employeeId}/comments`,
// //     {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(commentData),
// //     }
// //   );

// //   const data = await response.json();

// //   if (!response.ok) {
// //     throw new Error(data.message || "Failed to add comment");
// //   }

// //   return data;
// // };

// // // ======================================
// // // UPDATE COMMENT
// // // ======================================
// // export const updateComment = async (
// //   employeeId,
// //   commentId,
// //   comment
// // ) => {
// //   const response = await fetch(
// //     `${BASE_URL}/${employeeId}/comments/${commentId}`,
// //     {
// //       method: "PUT",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         comment,
// //       }),
// //     }
// //   );

// //   const data = await response.json();

// //   if (!response.ok) {
// //     throw new Error(data.message || "Failed to update comment");
// //   }

// //   return data;
// // };

// // // ======================================
// // // DELETE COMMENT
// // // ======================================
// // export const deleteComment = async (
// //   employeeId,
// //   commentId
// // ) => {
// //   const response = await fetch(
// //     `${BASE_URL}/${employeeId}/comments/${commentId}`,
// //     {
// //       method: "DELETE",
// //     }
// //   );

// //   const data = await response.json();

// //   if (!response.ok) {
// //     throw new Error(data.message || "Failed to delete comment");
// //   }

// //   return data;
// // };



// frontend/src/api/employeeApi.js

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = `${API_URL}/api/employees`;


// ======================================
// GET ALL EMPLOYEES
// ======================================
export const fetchEmployees = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return await response.json();
};

// ======================================
// GET EMPLOYEE BY ID
// ======================================
export const fetchEmployeeById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }

  return await response.json();
};

// ======================================
// CREATE EMPLOYEE
// ======================================
export const createEmployee = async (employee) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create employee");
  }

  return data;
};

// ======================================
// UPDATE EMPLOYEE
// ======================================
export const updateEmployee = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update employee");
  }

  return data;
};

// ======================================
// DELETE EMPLOYEE
// ======================================
export const deleteEmployee = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }

  return await response.json();
};


export const addComment = async (employeeId, commentData) => {
  const response = await fetch(
    `${BASE_URL}/${employeeId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add comment");
  }

  return data;
};

export const updateComment = async (
  employeeId,
  commentId,
  commentData
) => {
  const response = await fetch(
    `${BASE_URL}/${employeeId}/comments/${commentId}`,
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
    throw new Error(data.message || "Failed to update comment");
  }

  return data;
};

export const deleteComment = async (
  employeeId,
  commentId,
  role
) => {
  const response = await fetch(
    `${BASE_URL}/${employeeId}/comments/${commentId}?role=${role}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete comment");
  }

  return data;
};