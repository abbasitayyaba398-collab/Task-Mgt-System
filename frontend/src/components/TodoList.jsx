






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

const DEADLINE_QUICK_OPTIONS = [
  { value: "All", label: "All" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "next3", label: "Next 3 Days" },
  { value: "next5", label: "Next 5 Days" },
  { value: "next7", label: "Next 7 Days" },
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

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(dateA, dateB) {
  return startOfDay(dateA).getTime() === startOfDay(dateB).getTime();
}

// Returns true if `deadline` falls within the selected quick-range
function matchesDeadlineQuickFilter(deadline, quickFilter) {
  if (quickFilter === "All") return true;
  if (!deadline) return false;

  const deadlineDay = startOfDay(deadline);
  const today = startOfDay(new Date());

  switch (quickFilter) {
    case "overdue":
      return deadlineDay.getTime() < today.getTime();
    case "today":
      return isSameDay(deadlineDay, today);
    case "tomorrow":
      return isSameDay(deadlineDay, addDays(today, 1));
    case "next3":
      return (
        deadlineDay.getTime() >= today.getTime() &&
        deadlineDay.getTime() <= addDays(today, 3).getTime()
      );
    case "next5":
      return (
        deadlineDay.getTime() >= today.getTime() &&
        deadlineDay.getTime() <= addDays(today, 5).getTime()
      );
    case "next7":
      return (
        deadlineDay.getTime() >= today.getTime() &&
        deadlineDay.getTime() <= addDays(today, 7).getTime()
      );
    default:
      return true;
  }
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
  const [deadlineQuickFilter, setDeadlineQuickFilter] = useState("All");

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
      // Default view ("All") hides Approved tasks so the list
      // stays focused on active work. Selecting "Approved"
      // explicitly is the only way to see them.
      const matchesStatus =
        statusFilter === "All"
          ? todo.status !== "Approved"
          : todo.status === statusFilter;

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

      // --- Deadline quick filter (Today/Tomorrow/3/5/7 days/Overdue) ---
      const matchesDeadlineQuick = matchesDeadlineQuickFilter(
        todo.deadline,
        deadlineQuickFilter
      );

      return (
        matchesName &&
        matchesStatus &&
        matchesEmployee &&
        matchesCreatedDate &&
        matchesDeadlineDate &&
        matchesDeadlineQuick
      );
    });
  }, [
    todos,
    nameFilter,
    statusFilter,
    employeeFilter,
    createdDateFilter,
    deadlineDateFilter,
    deadlineQuickFilter,
  ]);

  const handleClearFilters = () => {
    setNameFilter("");
    setStatusFilter("All");
    setEmployeeFilter("All");
    setCreatedDateFilter("");
    setDeadlineDateFilter("");
    setDeadlineQuickFilter("All");
  };

  const hasActiveFilters =
    nameFilter !== "" ||
    statusFilter !== "All" ||
    employeeFilter !== "All" ||
    createdDateFilter !== "" ||
    deadlineDateFilter !== "" ||
    deadlineQuickFilter !== "All";

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

        {/* Deadline quick filter */}
        <div className="filter-group">
          <label htmlFor="deadlineQuickFilter">Deadline</label>
          <select
            id="deadlineQuickFilter"
            className="filter-select"
            value={deadlineQuickFilter}
            onChange={(e) => setDeadlineQuickFilter(e.target.value)}
          >
            {DEADLINE_QUICK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary filter-clear-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        )}

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

