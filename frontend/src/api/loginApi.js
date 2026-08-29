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

const BASE_URL = "http://localhost:5000/api/login";

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