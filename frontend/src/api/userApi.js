// // frontend/src/api/userApi.js

// const BASE_URL = "http://localhost:5000/api/users";

// // ==========================================
// // Get All Users
// // ==========================================
// export const fetchUsers = async () => {
//   const response = await fetch(BASE_URL);

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch users");
//   }

//   return data;
// };

// // ==========================================
// // Get User By Id
// // ==========================================
// export const fetchUserById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`);

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch user");
//   }

//   return data;
// };







const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = `${API_URL}/api/users`;

// ======================================
// GET ALL USERS
// ======================================
export const fetchUsers = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};

// ======================================
// GET USER BY ID
// ======================================
export const fetchUserById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};
