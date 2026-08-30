






// // frontend/src/components/TodoList.jsx

// import { useEffect, useState } from "react";
// import TodoItem from "./TodoItem";
// import { fetchEmployees } from "../api/employeeApi";

// function TodoList({
//   todos,
//   user,
//   users,
//   onToggleComplete,
//   onDelete,
//   onUpdate,
//   onAssignEmployee,
// }) {
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     const loadEmployees = async () => {
//       try {
//         const data = await fetchEmployees();
//         setEmployees(data);
//       } catch (err) {
//         console.error("Failed to load employees:", err);
//       }
//     };
//     loadEmployees();
//   }, []);

//   if (!todos || todos.length === 0) {
//     return (
//       <div className="empty-state">
//         <h3>No Tasks Found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="todo-table-container">
//       <table className="todo-table">

//         <thead>
//           <tr>
//             <th>S.No</th>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Assign To</th>
//             <th>Created By</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {todos.map((todo, index) => (
//             <TodoItem
//               key={todo._id}
//               index={index + 1}
//               todo={todo}
//               user={user}
//               users={users}
//               employees={employees}
//               onToggleComplete={onToggleComplete}
//               onDelete={onDelete}
//               onUpdate={onUpdate}
//               onAssignEmployee={onAssignEmployee}
//             />
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }

// export default TodoList;
// frontend/src/components/TodoList.jsx

import { useEffect, useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import { fetchEmployees } from "../api/employeeApi";

// ===========================
// Status filter dropdown options.
// "Approved" is included here so admin/anyone CAN filter
// to see approved tasks on demand — but by default
// (statusFilter === "All") approved tasks stay hidden.
// ===========================
const STATUS_FILTER_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Rejected",
  "Approved",
];

// ===========================
// Helpers — date normalization
// (compare by calendar day, ignore time)
// ===========================
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(dateA, dateB) {
  return startOfDay(dateA).getTime() === startOfDay(dateB).getTime();
}

function TodoList({
  todos,
  user,
  users,
  onToggleComplete,
  onDelete,
  onUpdate,
  onAssignEmployee,
}) {
  const [employees, setEmployees] = useState([]);

  // ===========================
  // Filter states
  // ===========================
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [createdDateFilter, setCreatedDateFilter] = useState(""); // exact created date (yyyy-mm-dd)
  const [deadlineDateFilter, setDeadlineDateFilter] = useState(""); // exact deadline date (yyyy-mm-dd)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };
    loadEmployees();
  }, []);

  // ===========================
  // Apply all filters together
  // ===========================
  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    return todos.filter((todo) => {
      // --- Name search (title) ---
      const name = nameFilter.trim().toLowerCase();
      const matchesName =
        name === "" || (todo.title || "").toLowerCase().includes(name);

      // --- Status filter ---
      // "All" shows every task regardless of status (including
      // Approved). Selecting a specific status narrows the list
      // down to just that status.
      const matchesStatus =
        statusFilter === "All" || todo.status === statusFilter;

      // --- Assign To filter ---
      const assignedIds = (todo.assignedTo || []).map(
        (emp) => emp?._id || emp
      );
      const matchesEmployee =
        employeeFilter === "All" || assignedIds.includes(employeeFilter);

      // --- Created date filter (exact day match) ---
      let matchesCreatedDate = true;
      if (createdDateFilter) {
        matchesCreatedDate =
          !!todo.createdAt &&
          isSameDay(
            todo.createdAt,
            new Date(createdDateFilter + "T00:00:00")
          );
      }

      // --- Deadline exact date filter ---
      let matchesDeadlineDate = true;
      if (deadlineDateFilter) {
        matchesDeadlineDate =
          !!todo.deadline &&
          isSameDay(
            todo.deadline,
            new Date(deadlineDateFilter + "T00:00:00")
          );
      }

      return (
        matchesName &&
        matchesStatus &&
        matchesEmployee &&
        matchesCreatedDate &&
        matchesDeadlineDate
      );
    });
  }, [
    todos,
    nameFilter,
    statusFilter,
    employeeFilter,
    createdDateFilter,
    deadlineDateFilter,
  ]);

  const handleClearFilters = () => {
    setNameFilter("");
    setStatusFilter("All");
    setEmployeeFilter("All");
    setCreatedDateFilter("");
    setDeadlineDateFilter("");
  };

  return (
    <div className="todo-table-container">

      {/* ===========================
          Filter Bar
      =========================== */}
      <div className="filter-bar">

        {/* Name search */}
        <div className="filter-group filter-search">
          <label htmlFor="nameFilter">Task Name</label>
          <input
            id="nameFilter"
            type="text"
            className="filter-input"
            placeholder="Search by task title..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="filter-group">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Assign To */}
        <div className="filter-group">
          <label htmlFor="employeeFilter">Assign To</label>
          <select
            id="employeeFilter"
            className="filter-select"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <option value="All">All</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Created date (exact) */}
        <div className="filter-group">
          <label htmlFor="createdDateFilter">Created Date</label>
          <input
            id="createdDateFilter"
            type="date"
            className="filter-input"
            value={createdDateFilter}
            onChange={(e) => setCreatedDateFilter(e.target.value)}
          />
        </div>

        {/* Deadline exact date */}
        <div className="filter-group">
          <label htmlFor="deadlineDateFilter">Deadline Date</label>
          <input
            id="deadlineDateFilter"
            type="date"
            className="filter-input"
            value={deadlineDateFilter}
            onChange={(e) => setDeadlineDateFilter(e.target.value)}
          />
        </div>

        {/* Clear Filters — always visible */}
        <button
          type="button"
          className="btn btn-secondary filter-clear-btn"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>

      </div>

      {/* ===========================
          Table
      =========================== */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <h3>No Tasks Found</h3>
        </div>
      ) : (
        <table className="todo-table">

          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assign To</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo._id}
                index={index + 1}
                todo={todo}
                user={user}
                users={users}
                employees={employees}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onAssignEmployee={onAssignEmployee}
              />
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

export default TodoList;