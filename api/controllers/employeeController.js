

// // backend/controllers/employeeController.js

// const Employee = require("../models/Employee");

// // ======================================
// // GET ALL EMPLOYEES
// // ======================================
// const getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find()
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role")
//       .sort({ createdAt: -1 });

//     res.status(200).json(employees);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employees",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // GET EMPLOYEE BY ID
// // ======================================
// const getEmployeeById = async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id)
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json(employee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employee",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // CREATE EMPLOYEE
// // ======================================
// const createEmployee = async (req, res) => {
//   try {
//     const {
//       name,
//       username,
//       contactNumber,
//       email,
//       password,
//       cnic,
//       dob,
//       address,
//       createdBy,
//     } = req.body;

//     if (
//       !name ||
//       !username ||
//       !contactNumber ||
//       !email ||
//       !password ||
//       !cnic ||
//       !dob ||
//       !address ||
//       !createdBy
//     ) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const employee = await Employee.create({
//       name,
//       username: username.trim(),
//       contactNumber,
//       email,
//       password,
//       cnic,
//       dob,
//       address,
//       createdBy,
//       comments: [],
//     });

//     const newEmployee = await Employee.findById(employee._id)
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     res.status(201).json(newEmployee);
//   } catch (error) {
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern || {})[0] || "field";
//       return res.status(400).json({
//         message: `An employee with this ${field} already exists`,
//       });
//     }

//     res.status(400).json({
//       message: "Failed to create employee",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // UPDATE EMPLOYEE
// // ======================================
// const updateEmployee = async (req, res) => {
//   try {
//     const {
//       name,
//       username,
//       contactNumber,
//       email,
//       password,
//       cnic,
//       dob,
//       address,
//     } = req.body;

//     const updateData = {
//       name,
//       username: username ? username.trim() : username,
//       contactNumber,
//       email,
//       cnic,
//       dob,
//       address,
//     };

//     // Password sirf tab update hoga jab naya password diya gaya ho.
//     // Blank chhodne par purana password wahi rahega.
//     if (password && password.trim() !== "") {
//       updateData.password = password;
//     }

//     const employee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     )
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json(employee);
//   } catch (error) {
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern || {})[0] || "field";
//       return res.status(400).json({
//         message: `An employee with this ${field} already exists`,
//       });
//     }

//     res.status(400).json({
//       message: "Failed to update employee",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // ADD COMMENT
// // POST /api/employees/:id/comments
// // Both Admin and User can add a comment.
// // ======================================
// const addComment = async (req, res) => {
//   try {
//     const { text, user, role } = req.body;

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         message: "Comment text is required",
//       });
//     }

//     const employee = await Employee.findById(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     employee.comments.push({
//       text: text.trim(),
//       user,
//       role,
//       createdAt: new Date(),
//     });

//     await employee.save();

//     const updatedEmployee = await Employee.findById(employee._id)
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     res.status(200).json(updatedEmployee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to add comment",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // UPDATE COMMENT
// // PUT /api/employees/:id/comments/:commentId
// // Admin only.
// // ======================================
// const updateComment = async (req, res) => {
//   try {
//     const { text, role } = req.body;

//     if (role !== "admin") {
//       return res.status(403).json({
//         message: "Only an admin can edit comments",
//       });
//     }

//     const employee = await Employee.findById(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     const comment = employee.comments.id(req.params.commentId);

//     if (!comment) {
//       return res.status(404).json({
//         message: "Comment not found",
//       });
//     }

//     comment.text = text;

//     await employee.save();

//     const updatedEmployee = await Employee.findById(employee._id)
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     res.status(200).json(updatedEmployee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update comment",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // DELETE COMMENT
// // DELETE /api/employees/:id/comments/:commentId
// // Admin only.
// // ======================================
// const deleteComment = async (req, res) => {
//   try {
//     const { role } = req.query;

//     if (role !== "admin") {
//       return res.status(403).json({
//         message: "Only an admin can delete comments",
//       });
//     }

//     const employee = await Employee.findById(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     employee.comments.pull(req.params.commentId);

//     await employee.save();

//     const updatedEmployee = await Employee.findById(employee._id)
//       .select("-password")
//       .populate("createdBy", "username")
//       .populate("comments.user", "username role");

//     res.status(200).json(updatedEmployee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete comment",
//       error: error.message,
//     });
//   }
// };

// // ======================================
// // DELETE EMPLOYEE
// // ======================================
// const deleteEmployee = async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndDelete(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json({
//       message: "Employee deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete employee",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getEmployees,
//   getEmployeeById,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   addComment,
//   updateComment,
//   deleteComment,
// };






// backend/controllers/employeeController.js

const Employee = require("../models/Employee");

// ======================================
// GET ALL EMPLOYEES
// ======================================
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// ======================================
// GET EMPLOYEE BY ID
// ======================================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// ======================================
// Helper: email se unique username generate karna
// ======================================
const generateUsernameFromEmail = async (email) => {
  const base = email.split("@")[0].toLowerCase();
  let candidate = base;
  let counter = 1;

  while (await Employee.findOne({ username: candidate })) {
    candidate = `${base}${counter}`;
    counter += 1;
  }

  return candidate;
};

// ======================================
// CREATE EMPLOYEE
// ======================================
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      role,
      contactNumber,
      email,
      password,
      cnic,
      dob,
      address,
      createdBy,
      createdByName,
    } = req.body;

    if (
      !name ||
      !contactNumber ||
      !email ||
      !password ||
      !cnic ||
      !dob ||
      !address ||
      !createdBy
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const username = await generateUsernameFromEmail(email);

    const employee = await Employee.create({
      name,
      username,
      role: role || "employee",
      contactNumber,
      email,
      password,
      cnic,
      dob,
      address,
      createdBy,
      createdByName,
      comments: [],
    });

    const newEmployee = await Employee.findById(employee._id)
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `An employee with this ${field} already exists`,
      });
    }

    res.status(400).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE EMPLOYEE
// ======================================
const updateEmployee = async (req, res) => {
  try {
    const {
      name,
      role,
      contactNumber,
      email,
      password,
      cnic,
      dob,
      address,
    } = req.body;

    const updateData = {
      name,
      role,
      contactNumber,
      email,
      cnic,
      dob,
      address,
    };

    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `An employee with this ${field} already exists`,
      });
    }

    res.status(400).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// ======================================
// ADD COMMENT
// ======================================
const addComment = async (req, res) => {
  try {
    const { text, user, role } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.comments.push({
      text: text.trim(),
      user,
      role,
      createdAt: new Date(),
    });

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    res.status(200).json(updatedEmployee);
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
    const { text, role } = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only an admin can edit comments",
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const comment = employee.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.text = text;

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    res.status(200).json(updatedEmployee);
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
    const { role } = req.query;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only an admin can delete comments",
      });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.comments.pull(req.params.commentId);

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .select("-password")
      .populate("createdBy", "username")
      .populate("comments.user", "username role");

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

// ======================================
// DELETE EMPLOYEE
// ======================================
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  addComment,
  updateComment,
  deleteComment,
};