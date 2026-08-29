// import { useState, useEffect } from "react";
// import {
//   Routes,
//   Route,
//   Navigate,
//   NavLink,
//   useNavigate,
// } from "react-router-dom";

// import Header from "./components/Header";
// import LoginForm from "./components/LoginForm";
// import TodoForm from "./components/TodoForm";
// import TodoList from "./components/TodoList";
// import EmployeeDashboard from "./components/EmployeeDashboard";
// import EmployeeView from "./components/EmployeeView";
// import TaskView from "./components/TaskView";
// import NotificationBell from "./components/NotificationBell";
// import NotificationsPage from "./components/NotificationsPage";
// import {
//   fetchTodos,
//   createTodo,
//   updateTodo,
//   deleteTodo,
//   assignTodo,
// } from "./api/todoApi";

// import { fetchUsers } from "./api/userApi";
// import {
//   fetchNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
// } from "./api/notificationApi";
// import socket from "./socket";

// import "./App.css";

// function App() {
//   const navigate = useNavigate();

//   // ==========================
//   // Login State (Local Storage persistent)
//   // ==========================
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return !!localStorage.getItem("user");
//   });

//   // ==========================
//   // Todo State
//   // ==========================
//   const [todos, setTodos] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ==========================
//   // Notifications State
//   // ==========================
//   const [notifications, setNotifications] = useState([]);

//   const currentUserId = user?.id || user?._id;

//   // ==========================
//   // Login Handler
//   // ==========================
//   const handleLogin = (loggedInUser) => {
//     localStorage.setItem("user", JSON.stringify(loggedInUser)); // LocalStorage mein save kiya
//     setUser(loggedInUser);
//     setIsLoggedIn(true);
//   };

//   // ==========================
//   // Logout Handler
//   // ==========================
//   const handleLogout = () => {
//     localStorage.removeItem("user"); // LocalStorage se remove kiya
//     setIsLoggedIn(false);
//     setUser(null);
//     setTodos([]);
//     setUsers([]);
//     setNotifications([]);
//     navigate("/");
//   };

//   // ==========================
//   // Load Data
//   // ==========================
//   useEffect(() => {
//     if (!isLoggedIn || !user) return;

//     loadTodos();
//     loadUsers();
//     loadNotifications();
//   }, [isLoggedIn, user]);

//   // ==========================
//   // Load Todos
//   // ==========================
//   const loadTodos = async () => {
//     try {
//       setLoading(true);

//       const data = await fetchTodos(user);

//       setTodos(data);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // Load Notifications
//   // (Ab yeh backend se history fetch karta hai — sirf live/
//   // session tak mehdood nahi rehti, login karte hi purani
//   // notifications bhi bell mein dikh jaati hain.)
//   // ==========================
//   const loadNotifications = async () => {
//     try {
//       const data = await fetchNotifications(currentUserId);
//       setNotifications(data);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   // ==========================
//   // Load Users
//   // ==========================
//   const loadUsers = async () => {
//     try {
//       const data = await fetchUsers();
//       setUsers(data);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   // ==========================
//   // SOCKET.IO — Real-time sync
//   //
//   // Todo list, task detail (comments/logs) aur notifications —
//   // teeno bina page refresh kiye khud update hote hain jab
//   // koi bhi (dusre browser/tab/user) koi change karta hai.
//   // ==========================
//   useEffect(() => {
//     if (!isLoggedIn || !currentUserId) return;

//     // Personal notification room join karo
//     socket.emit("join", { userId: currentUserId });

//     const handleTaskCreated = (newTodo) => {
//       setTodos((prev) => {
//         // Employee ke liye sirf assigned tasks relevant hain
//         if (user.role !== "admin") {
//           const assignedIds = (newTodo.assignedTo || []).map(
//             (emp) => emp?._id || emp
//           );
//           if (!assignedIds.includes(currentUserId)) {
//             return prev;
//           }
//         }

//         if (prev.some((t) => t._id === newTodo._id)) return prev;
//         return [newTodo, ...prev];
//       });
//     };

//     const handleTaskUpdated = (updatedTodo) => {
//       setTodos((prev) => {
//         const exists = prev.some((t) => t._id === updatedTodo._id);

//         if (exists) {
//           return prev.map((t) =>
//             t._id === updatedTodo._id ? updatedTodo : t
//           );
//         }

//         // Task pehle list me nahi tha (e.g. employee ko naya
//         // assign hua) — agar relevant hai to add kar do.
//         if (user.role !== "admin") {
//           const assignedIds = (updatedTodo.assignedTo || []).map(
//             (emp) => emp?._id || emp
//           );
//           if (assignedIds.includes(currentUserId)) {
//             return [updatedTodo, ...prev];
//           }
//         }

//         return prev;
//       });
//     };

//     const handleTaskDeleted = ({ _id }) => {
//       setTodos((prev) => prev.filter((t) => t._id !== _id));
//     };

//     const handleNewNotification = (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     };

//     socket.on("task:created", handleTaskCreated);
//     socket.on("task:updated", handleTaskUpdated);
//     socket.on("task:deleted", handleTaskDeleted);
//     socket.on("notification:new", handleNewNotification);

//     return () => {
//       socket.off("task:created", handleTaskCreated);
//       socket.off("task:updated", handleTaskUpdated);
//       socket.off("task:deleted", handleTaskDeleted);
//       socket.off("notification:new", handleNewNotification);
//     };
//   }, [isLoggedIn, currentUserId, user]);

//   // ==========================
//   // Notification Actions
//   // (Ab backend mein bhi save hoti hain, sirf local state nahi)
//   // ==========================
//   const handleMarkNotificationRead = async (notificationId) => {
//     setNotifications((prev) =>
//       prev.map((n) =>
//         n._id === notificationId ? { ...n, isRead: true } : n
//       )
//     );

//     try {
//       await markNotificationRead(notificationId);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   const handleMarkAllNotificationsRead = async () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

//     try {
//       await markAllNotificationsRead(currentUserId);
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   // ==========================
//   // Who performed the action
//   // (used to build task logs)
//   // ==========================
//   const buildPerformedBy = () => ({
//     performedById: user?.id || user?._id || "",
//     performedByName: user?.name || user?.username || "Someone",
//     performedByRole: user?.role || "",
//   });

//   // ==========================
//   // Create Todo
//   // ==========================
//   const handleAddTodo = async (todoData) => {
//     try {
//       const newTodo = await createTodo({
//         ...todoData,
//         ...buildPerformedBy(),
//       });

//       setTodos((prev) => {
//         if (prev.some((t) => t._id === newTodo._id)) return prev;
//         return [newTodo, ...prev];
//       });

//       setError("");

//       // Task ban jane ke baad "Create Task" ke alag page se
//       // wapas "Task List" par le jao, taake naya task turant
//       // list mein dikh jaye.
//       navigate("/tasks");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // ==========================
//   // Update Todo
//   // ==========================
//   const handleUpdate = async (id, updatedData) => {
//     try {
//       const updatedTodo = await updateTodo(id, {
//         ...updatedData,
//         ...buildPerformedBy(),
//       });

//       setTodos((prev) =>
//         prev.map((todo) => (todo._id === id ? updatedTodo : todo))
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // ==========================
//   // Update Status
//   // ==========================
//   const handleToggleComplete = async (id, updatedData) => {
//     try {
//       const updatedTodo = await updateTodo(id, {
//         ...updatedData,
//         ...buildPerformedBy(),
//       });

//       setTodos((prev) =>
//         prev.map((todo) => (todo._id === id ? updatedTodo : todo))
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };
//   // ==========================
//   // Assign User
//   // ==========================
//   const handleAssignUser = async (todoId, userId) => {
//     try {
//       const updatedTodo = await assignTodo(
//         todoId,
//         userId,
//         buildPerformedBy()
//       );

//       setTodos((prev) =>
//         prev.map((todo) => (todo._id === todoId ? updatedTodo : todo))
//       );

//       // Apni khud ki bell par turant confirmation notification
//       setNotifications((prev) => [
//         {
//           _id: `local-${todoId}-${Date.now()}`,
//           message: `Task "${updatedTodo.title}" assigned successfully`,
//           todo: updatedTodo._id,
//           createdAt: new Date(),
//           isRead: false,
//         },
//         ...prev,
//       ]);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
//   // ==========================
//   // Delete Todo
//   // ==========================
//   const handleDelete = async (id) => {
//     try {
//       await deleteTodo(id);

//       setTodos((prev) => prev.filter((todo) => todo._id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // ==========================
//   // Login Screen
//   // ==========================
//   if (!isLoggedIn) {
//     return (
//       <div className="app-container">
//         <Header />
//         <LoginForm onLogin={handleLogin} />
//       </div>
//     );
//   }

//   const isAdmin = user.role === "admin";

//   const taskListElement = loading ? (
//     <h3>Loading...</h3>
//   ) : (
//     <TodoList
//       todos={todos}
//       users={users}
//       user={user}
//       onToggleComplete={handleToggleComplete}
//       onDelete={handleDelete}
//       onUpdate={handleUpdate}
//       onAssignEmployee={handleAssignUser}
//     />
//   );

//   // ==========================
//   // Dashboard
//   // ==========================
//   return (
//     <div className="app-container">
//       <Header />

//       <div className="top-bar">
//         <div>
//           <strong>User:</strong> {user.name || user.username}
//           &nbsp;&nbsp; | &nbsp;&nbsp;
//           <strong>Role:</strong> {user.role}
//         </div>

//         <div className="top-bar-actions">
//           <NotificationBell
//             notifications={notifications}
//             onMarkRead={handleMarkNotificationRead}
//             onMarkAllRead={handleMarkAllNotificationsRead}
//           />

//           <button className="btn btn-danger" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* ==========================
//           Admin Navigation
//       ========================== */}
//       {isAdmin && (
//         <nav className="tab-menu">
//           {/* Create Task */}
//           <NavLink
//             to="/tasks/create"
//             className={({ isActive }) =>
//               `tab-btn ${isActive ? "tab-btn-active" : ""}`
//             }
//           >
//             Create Task
//           </NavLink>

//           {/* Task List */}
//           <NavLink
//             to="/tasks"
//             end
//             className={({ isActive }) =>
//               `tab-btn ${isActive ? "tab-btn-active" : ""}`
//             }
//           >
//             Task List
//           </NavLink>

//           {/* Employees */}
//           <NavLink
//             to="/employees"
//             className={({ isActive }) =>
//               `tab-btn ${isActive ? "tab-btn-active" : ""}`
//             }
//           >
//             Employees
//           </NavLink>

//           {/* Add Employee */}
//           <NavLink
//             to="/admin/employees"
//             className={({ isActive }) =>
//               `tab-btn ${isActive ? "tab-btn-active" : ""}`
//             }
//           >
//             Add New Employees
//           </NavLink>
//         </nav>
//       )}

//       {error && <div className="error-banner">{error}</div>}

//       {/* ==========================
//           Routes — available for BOTH
//           Admin and Employee so an
//           employee can open their own
//           task's detail + comments page.
//       ========================== */}
//       <Routes>

//         {/* CREATE TASK — separate page, own tab */}
//         {isAdmin && (
//           <Route
//             path="/tasks/create"
//             element={<TodoForm onAddTodo={handleAddTodo} user={user} />}
//           />
//         )}

//         {/* TASK LIST */}
//         <Route
//           path="/tasks"
//           element={taskListElement}
//         />

//         {/* TASK DETAILS — Admin & Employee (read + comments) */}
//         <Route
//           path="/tasks/view/:id"
//           element={<TaskView user={user} />}
//         />

//         {/* NOTIFICATIONS — "View All" full page, Admin & Employee both */}
//         <Route
//           path="/notifications"
//           element={
//             <NotificationsPage
//               notifications={notifications}
//               onMarkRead={handleMarkNotificationRead}
//               onMarkAllRead={handleMarkAllNotificationsRead}
//             />
//           }
//         />

//         {/* Admin-only routes */}
//         {isAdmin && (
//           <Route
//             path="/employees"
//             element={<EmployeeDashboard user={user} showForm={false} />}
//           />
//         )}

//         {isAdmin && (
//           <Route
//             path="/admin/employees"
//             element={<EmployeeDashboard user={user} showForm={true} />}
//           />
//         )}

//         {isAdmin && (
//           <Route
//             path="/admin/employees/add"
//             element={<EmployeeDashboard user={user} showForm={true} />}
//           />
//         )}

//         {isAdmin && (
//           <Route
//             path="/admin/employees/edit/:id"
//             element={<EmployeeDashboard user={user} showForm={true} />}
//           />
//         )}

//         {isAdmin && (
//           <Route
//             path="/admin/employees/view/:id"
//             element={<EmployeeView />}
//           />
//         )}

//         {isAdmin && (
//           <Route
//             path="/admin/tasks/edit/:id"
//             element={<TaskView user={user} />}
//           />
//         )}

//         {/* Default Route */}
//         <Route path="*" element={<Navigate to="/tasks" replace />} />

//       </Routes>
//     </div>
//   );
// }

// export default App;



import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployeeView from "./components/EmployeeView";
import TaskView from "./components/TaskView";
import NotificationBell from "./components/NotificationBell";
import NotificationsPage from "./components/NotificationsPage";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  assignTodo,
} from "./api/todoApi";

import { fetchUsers } from "./api/userApi";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./api/notificationApi";
import socket from "./socket";

import "./App.css";

function App() {
  const navigate = useNavigate();

  // ==========================
  // Login State (Local Storage persistent)
  // ==========================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });

  // ==========================
  // Todo State
  // ==========================
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // Notifications State
  // ==========================
  const [notifications, setNotifications] = useState([]);

  const currentUserId = user?.id || user?._id;

  // ==========================
  // Login Handler
  // ==========================
  const handleLogin = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser)); // LocalStorage mein save kiya
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  // ==========================
  // Logout Handler
  // ==========================
  const handleLogout = () => {
    localStorage.removeItem("user"); // LocalStorage se remove kiya
    setIsLoggedIn(false);
    setUser(null);
    setTodos([]);
    setUsers([]);
    setNotifications([]);
    navigate("/");
  };

  // ==========================
  // Load Data
  // ==========================
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    loadTodos();
    loadUsers();
    loadNotifications();
  }, [isLoggedIn, user]);

  // ==========================
  // Load Todos
  // ==========================
  const loadTodos = async () => {
    try {
      setLoading(true);

      const data = await fetchTodos(user);

      setTodos(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Notifications
  // (Ab yeh backend se history fetch karta hai — sirf live/
  // session tak mehdood nahi rehti, login karte hi purani
  // notifications bhi bell mein dikh jaati hain.)
  // ==========================
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications(currentUserId);
      setNotifications(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ==========================
  // Load Users
  // ==========================
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ==========================
  // SOCKET.IO — Real-time sync
  //
  // Todo list, task detail (comments/logs) aur notifications —
  // teeno bina page refresh kiye khud update hote hain jab
  // koi bhi (dusre browser/tab/user) koi change karta hai.
  // ==========================
  useEffect(() => {
    if (!isLoggedIn || !currentUserId) return;

    // Personal notification room join karo
    socket.emit("join", { userId: currentUserId });

    const handleTaskCreated = (newTodo) => {
      setTodos((prev) => {
        // Employee ke liye sirf assigned tasks relevant hain
        if (user.role !== "admin") {
          const assignedIds = (newTodo.assignedTo || []).map(
            (emp) => emp?._id || emp
          );
          if (!assignedIds.includes(currentUserId)) {
            return prev;
          }
        }

        if (prev.some((t) => t._id === newTodo._id)) return prev;
        return [newTodo, ...prev];
      });
    };

    const handleTaskUpdated = (updatedTodo) => {
      setTodos((prev) => {
        const exists = prev.some((t) => t._id === updatedTodo._id);

        if (exists) {
          return prev.map((t) =>
            t._id === updatedTodo._id ? updatedTodo : t
          );
        }

        // Task pehle list me nahi tha (e.g. employee ko naya
        // assign hua) — agar relevant hai to add kar do.
        if (user.role !== "admin") {
          const assignedIds = (updatedTodo.assignedTo || []).map(
            (emp) => emp?._id || emp
          );
          if (assignedIds.includes(currentUserId)) {
            return [updatedTodo, ...prev];
          }
        }

        return prev;
      });
    };

    const handleTaskDeleted = ({ _id }) => {
      setTodos((prev) => prev.filter((t) => t._id !== _id));
    };

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
      socket.off("notification:new", handleNewNotification);
    };
  }, [isLoggedIn, currentUserId, user]);

  // ==========================
  // Notification Actions
  // (Ab backend mein bhi save hoti hain, sirf local state nahi)
  // ==========================
  const handleMarkNotificationRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );

    try {
      await markNotificationRead(notificationId);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await markAllNotificationsRead(currentUserId);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ==========================
  // Who performed the action
  // (used to build task logs)
  // ==========================
  const buildPerformedBy = () => ({
    performedById: user?.id || user?._id || "",
    performedByName: user?.name || user?.username || "Someone",
    performedByRole: user?.role || "",
  });

  // ==========================
  // Create Todo
  //
  // `todoData` ab FormData hota hai (TodoForm.jsx file
  // attachment ke sath FormData banata hai). Isliye yahan
  // "...spread" nahi kar sakte — performedBy fields ko
  // FormData mein hi append karte hain.
  // ==========================
  const handleAddTodo = async (todoData) => {
    try {
      const performedBy = buildPerformedBy();

      if (todoData instanceof FormData) {
        Object.entries(performedBy).forEach(([key, value]) => {
          todoData.append(key, value);
        });
      }

      const newTodo = await createTodo(
        todoData instanceof FormData
          ? todoData
          : { ...todoData, ...performedBy }
      );

      setTodos((prev) => {
        if (prev.some((t) => t._id === newTodo._id)) return prev;
        return [newTodo, ...prev];
      });

      setError("");

      // Task ban jane ke baad "Create Task" ke alag page se
      // wapas "Task List" par le jao, taake naya task turant
      // list mein dikh jaye.
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================
  // Update Todo
  // ==========================
  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedTodo = await updateTodo(id, {
        ...updatedData,
        ...buildPerformedBy(),
      });

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================
  // Update Status
  // ==========================
  const handleToggleComplete = async (id, updatedData) => {
    try {
      const updatedTodo = await updateTodo(id, {
        ...updatedData,
        ...buildPerformedBy(),
      });

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  // ==========================
  // Assign User
  // ==========================
  const handleAssignUser = async (todoId, userId) => {
    try {
      const updatedTodo = await assignTodo(
        todoId,
        userId,
        buildPerformedBy()
      );

      setTodos((prev) =>
        prev.map((todo) => (todo._id === todoId ? updatedTodo : todo))
      );

      // Apni khud ki bell par turant confirmation notification
      setNotifications((prev) => [
        {
          _id: `local-${todoId}-${Date.now()}`,
          message: `Task "${updatedTodo.title}" assigned successfully`,
          todo: updatedTodo._id,
          createdAt: new Date(),
          isRead: false,
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message);
    }
  };
  // ==========================
  // Delete Todo
  // ==========================
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================
  // Login Screen
  // ==========================
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <Header />
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  const taskListElement = loading ? (
    <h3>Loading...</h3>
  ) : (
    <TodoList
      todos={todos}
      users={users}
      user={user}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onAssignEmployee={handleAssignUser}
    />
  );

  // ==========================
  // Dashboard
  // ==========================
  return (
    <div className="app-container">
      <Header />

      <div className="top-bar">
        <div>
          <strong>User:</strong> {user.name || user.username}
          &nbsp;&nbsp; | &nbsp;&nbsp;
          <strong>Role:</strong> {user.role}
        </div>

        <div className="top-bar-actions">
          <NotificationBell
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ==========================
          Admin Navigation
      ========================== */}
      {isAdmin && (
        <nav className="tab-menu">
          {/* Create Task */}
          <NavLink
            to="/tasks/create"
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-btn-active" : ""}`
            }
          >
            Create Task
          </NavLink>

          {/* Task List */}
          <NavLink
            to="/tasks"
            end
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-btn-active" : ""}`
            }
          >
            Task List
          </NavLink>

          {/* Employees */}
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-btn-active" : ""}`
            }
          >
            Employees
          </NavLink>

          {/* Add Employee */}
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              `tab-btn ${isActive ? "tab-btn-active" : ""}`
            }
          >
            Add New Employees
          </NavLink>
        </nav>
      )}

      {error && <div className="error-banner">{error}</div>}

      {/* ==========================
          Routes — available for BOTH
          Admin and Employee so an
          employee can open their own
          task's detail + comments page.
      ========================== */}
      <Routes>

        {/* CREATE TASK — separate page, own tab */}
        {isAdmin && (
          <Route
            path="/tasks/create"
            element={<TodoForm onAddTodo={handleAddTodo} user={user} />}
          />
        )}

        {/* TASK LIST */}
        <Route
          path="/tasks"
          element={taskListElement}
        />

        {/* TASK DETAILS — Admin & Employee (read + comments) */}
        <Route
          path="/tasks/view/:id"
          element={<TaskView user={user} />}
        />

        {/* NOTIFICATIONS — "View All" full page, Admin & Employee both */}
        <Route
          path="/notifications"
          element={
            <NotificationsPage
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />
          }
        />

        {/* Admin-only routes */}
        {isAdmin && (
          <Route
            path="/employees"
            element={<EmployeeDashboard user={user} showForm={false} />}
          />
        )}

        {isAdmin && (
          <Route
            path="/admin/employees"
            element={<EmployeeDashboard user={user} showForm={true} />}
          />
        )}

        {isAdmin && (
          <Route
            path="/admin/employees/add"
            element={<EmployeeDashboard user={user} showForm={true} />}
          />
        )}

        {isAdmin && (
          <Route
            path="/admin/employees/edit/:id"
            element={<EmployeeDashboard user={user} showForm={true} />}
          />
        )}

        {isAdmin && (
          <Route
            path="/admin/employees/view/:id"
            element={<EmployeeView />}
          />
        )}

        {isAdmin && (
          <Route
            path="/admin/tasks/edit/:id"
            element={<TaskView user={user} />}
          />
        )}

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />

      </Routes>
    </div>
  );
}

export default App;