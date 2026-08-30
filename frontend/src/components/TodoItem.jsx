




// frontend/src/components/TodoItem.jsx
import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ===========================
// Full status list (admin sees all of these)
// ===========================
const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Completed",
  "Rejected",
  "Approved",
];

// ===========================
// Statuses a non-admin (employee) is allowed to set.
// "Approved" is intentionally excluded — only admin can approve.
// ===========================
const EMPLOYEE_STATUS_OPTIONS = STATUS_OPTIONS.filter(
  (status) => status !== "Approved"
);

// ===========================
// Short preview of the description
// (only 3-4 words in the list view)
// ===========================
const DESCRIPTION_WORD_LIMIT = 4;

function truncateWords(text) {
  if (!text) return "-";

  const words = text.trim().split(/\s+/);

  if (words.length <= DESCRIPTION_WORD_LIMIT) {
    return words.join(" ");
  }

  return words.slice(0, DESCRIPTION_WORD_LIMIT).join(" ") + "...";
}

// ===========================
// assignedTo can be an array of
// populated Employee objects (or IDs)
// ===========================
function getAssignedIds(todo) {
  return (todo.assignedTo || [])
    .map((emp) => emp?._id || emp)
    .filter(Boolean);
}

function getAssignedNames(todo) {
  const names = (todo.assignedTo || [])
    .map((emp) => emp?.name)
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "-";
}

// ===========================
// createdBy can have different possible
// fields depending on backend populate —
// try common ones as fallback
// ===========================
function getCreatedByLabel(todo) {
  return (
    todo.createdBy?.username ||
    todo.createdBy?.name ||
    todo.createdBy?.email ||
    "-"
  );
}

function TodoItem({
  index,
  todo,
  user,
  users = [],
  employees = [],
  onToggleComplete,
  onDelete,
  onUpdate,
  onAssignEmployee,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );

  const isAdmin = user.role === "admin";

  // ===========================
  // A non-admin cannot touch a task that is
  // already Approved — treat it as locked/read-only
  // ===========================
  const isLockedForEmployee = !isAdmin && todo.status === "Approved";

  // ===========================
  // Save
  // ===========================
  const handleSave = () => {
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    onUpdate(todo._id, {
      title: editTitle,
      description: editDescription,
    });

    setIsEditing(false);
  };

  // ===========================
  // Cancel
  // ===========================
  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  // ===========================
  // Status Change
  // ===========================
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    // Safety net: even if somehow triggered, block employees
    // from setting "Approved" status.
    if (newStatus === "Approved" && !isAdmin) {
      return;
    }

    onToggleComplete(todo._id, {
      status: newStatus,
    });
  };

  // ===========================
  // Assign Employees (multiple) — via checkboxes now
  // ===========================
  const toggleAssignEmployee = (employeeId) => {
    const isAlreadyAssigned = assignedIds.includes(employeeId);

    const newSelectedIds = isAlreadyAssigned
      ? assignedIds.filter((id) => id !== employeeId)
      : [...assignedIds, employeeId];

    onAssignEmployee(todo._id, newSelectedIds);
  };

  const assignedIds = getAssignedIds(todo);
  const assignedNames = getAssignedNames(todo);
  const createdByLabel = getCreatedByLabel(todo);

  // Which status options this user is allowed to see/pick
  const statusOptionsForUser = isAdmin
    ? STATUS_OPTIONS
    : EMPLOYEE_STATUS_OPTIONS;

  // ===========================
  // Edit Row
  // ===========================
  if (isEditing) {
    return (
      <tr>
        <td>{index}</td>

        <td>
          <input
            className="todo-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </td>

        <td>
          <textarea
            className="todo-textarea"
            rows="2"
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
          />
        </td>

        <td>{todo.status}</td>

        <td>{assignedNames}</td>

        <td>{createdByLabel}</td>

        {isAdmin && (
          <td>
            <div className="actions-cell">
              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </td>
        )}
      </tr>
    );
  }

  return (
    <tr>

      {/* Serial Number */}
      <td>{index}</td>

      {/* Title */}
      <td>{todo.title}</td>

      {/* Description (short preview — 3-4 words only) */}
      <td title={todo.description || ""}>
        {truncateWords(todo.description)}
      </td>

      {/* Status */}
      <td>
        {isLockedForEmployee ? (
          // Employee cannot modify an already-approved task —
          // show as a plain read-only badge instead of a dropdown.
          <span className="status-badge status-approved">
            {todo.status}
          </span>
        ) : (
          <select
            className="status-select"
            value={todo.status}
            onChange={handleStatusChange}
          >
            {statusOptionsForUser.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}

            {/* If task is already Approved but somehow current user
                is not admin and we still reached here, keep the
                current value selectable so the <select> doesn't
                silently show a blank/mismatched value. */}
            {!isAdmin && todo.status === "Approved" && (
              <option value="Approved">Approved</option>
            )}
          </select>
        )}
      </td>

      {/* Assign To (multiple employees via checkboxes) */}
      <td>

        {isAdmin ? (

          <div
            className="assign-checkbox-list"
            title="Employee(s)  select/deselect  from checkbox"
          >
            {employees.map((employee) => (
              <label
                key={employee._id}
                className="assign-checkbox-item"
              >
                <input
                  type="checkbox"
                  checked={assignedIds.includes(employee._id)}
                  onChange={() =>
                    toggleAssignEmployee(employee._id)
                  }
                />
                <span>{employee.name}</span>
              </label>
            ))}
          </div>

        ) : (

          assignedNames

        )}

      </td>

      {/* Created By */}
      <td>
        {createdByLabel}
      </td>

      {/* Actions */}
      <td>
        <div className="actions-cell">

          {isAdmin ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  navigate(`/tasks/view/${todo._id}`)
                }
              >
                <FaEye />
              </button>
              <button
                className="btn btn-edit"
                onClick={() =>
                  navigate(`/admin/tasks/edit/${todo._id}`)
                }
              >
                <FaEdit />
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onDelete(todo._id)}
              >
                <FaTrash />
              </button>
            </>
          ) : (
            // Employee: view-only — opens task details + comments
            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate(`/tasks/view/${todo._id}`)
              }
            >
              <FaEye /> View
            </button>
          )}

        </div>
      </td>

    </tr>
  );
}

export default TodoItem;