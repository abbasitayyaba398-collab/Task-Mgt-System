// // src/api/loginApi.js

// const BASE_URL = "http://localhost:5000/api/login";

// export const loginUser = async (username, password) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username,
//       password,
//     }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Login Failed");
//   }

//   return data;
// };






// src/api/loginApi.js


const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = `${API_URL}/api/login`;

export const loginUser = async (email, password) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data;
};
