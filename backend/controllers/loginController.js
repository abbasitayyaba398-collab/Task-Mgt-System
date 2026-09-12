// // backend/controllers/loginController.js

// const User = require("../models/User");

// // =====================================
// // Login User
// // POST /api/login
// // =====================================
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         message: "Username and Password are required",
//       });
//     }

//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid Username",
//       });
//     }

//     if (user.password !== password) {
//       return res.status(401).json({
//         message: "Invalid Password",
//       });
//     }

//     res.status(200).json({
//       message: "Login Successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   loginUser,
// };




// backend/controllers/loginController.js

const User = require("../models/User");
const Employee = require("../models/Employee");

// =====================================
// Login User
// POST /api/login
// Employee collection ke against email + password check hota hai.
// Role (admin/employee) Employee document se hi aata hai.
// =====================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const employee = await Employee.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!employee) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    if (employee.password !== password) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: employee._id,
        name: employee.name,
        username: employee.username,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
};