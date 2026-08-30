import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchTaskById,
  updateTodo,
  deleteTodo,
  addTaskComment,
  updateTaskComment,
  deleteTaskComment,
  FILE_BASE_URL,
} from "../api/todoApi";
import { fetchEmployees } from "../api/employeeApi";

// ==========================
// Full status list.
// "Approved" is only ever shown to admins (see statusOptionsForUser
// below) — same rule TodoItem.jsx already follows for the table.
// ==========================
const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Completed",
  "Rejected",
];

const ADMIN_ONLY_STATUS = "Approved";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

// ==========================
// Deadline helpers
// - Backend stores deadline as an ISO string.
// - <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm".
// ==========================
function formatDateForInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function TaskView({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.pathname.includes("/edit/");

  const [task, setTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState([]);

  // ==========================
  // Deadline (edit mode)
  // ==========================
  const [deadline, setDeadline] = useState("");

  // ==========================
  // Attachment (edit mode) — holds a newly picked File,
  // only sent to the backend if the user actually chooses one.
  // ==========================
  const [attachment, setAttachment] = useState(null);

  // ==========================
  // Employees (for the Assign
  // To multi-select in edit mode)
  // ==========================
  const [employees, setEmployees] = useState([]);

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

  // ==========================
  // Comments
  // ==========================
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  // ==========================
  // User Role
  // ==========================
  const isAdmin =
    String(user?.role || "").toLowerCase() === "admin";

  const isEmployee =
    String(user?.role || "").toLowerCase() === "employee";

  // Current logged-in user ID
  const currentUserId = user?.id || user?._id;

  // ==========================
  // Who performed the action
  // (used to build task logs)
  // ==========================
  const getPerformedBy = () => ({
    performedById: user?.id || user?._id || "",
    performedByName: user?.name || user?.username || "Someone",
    performedByRole: user?.role || "",
  });

  // ==========================
  // Load Task
  // ==========================
  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await fetchTaskById(id);

      setTask(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setStatus(data.status || "Pending");
      setAssignedTo(
        (data.assignedTo || [])
          .map((emp) => emp?._id || emp)
          .filter(Boolean)
      );
      setDeadline(formatDateForInput(data.deadline));
      setAttachment(null);
    } catch (err) {
      console.error("Failed to load task:", err);
    }
  };

  // ==========================
  // Get Assigned Employee IDs
  // (task can now be assigned
  // to multiple employees)
  // ==========================
  const assignedEmployeeIds = (task?.assignedTo || [])
    .map((emp) => emp?._id || emp)
    .filter(Boolean)
    .map(String);

  // ==========================
  // Check Assigned Employee
  // ==========================
  const isAssignedEmployee =
    isEmployee &&
    currentUserId &&
    assignedEmployeeIds.includes(String(currentUserId));

  // ==========================
  // Comment Permission
  //
  // Admin:
  // Can comment on any task
  //
  // Assigned Employee:
  // Can comment only
  // on assigned task
  //
  // Other Employee:
  // Cannot comment
  // ==========================
  const canComment =
    isAdmin || isAssignedEmployee;

  // Which status options this user is allowed to see/pick.
  // Same rule as TodoItem.jsx: only admin can see/set "Approved".
  const statusOptionsForUser = isAdmin
    ? [...STATUS_OPTIONS, ADMIN_ONLY_STATUS]
    : STATUS_OPTIONS;

  // ==========================
  // Status Change
  // ==========================
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    // Safety net: even if somehow triggered, block non-admins
    // from setting "Approved" status.
    if (newStatus === ADMIN_ONLY_STATUS && !isAdmin) {
      return;
    }

    setStatus(newStatus);
  };

  // ==========================
  // Save Task
  // ==========================
  const handleSave = async () => {
    try {
      const performedBy = getPerformedBy();

      // If a new attachment was picked, we need multipart/form-data
      // so the file actually reaches the backend.
      if (attachment) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);

        assignedTo.forEach((empId) =>
          formData.append("assignedTo", empId)
        );

        if (deadline) {
          formData.append("deadline", deadline);
        }

        formData.append("attachment", attachment);

        Object.entries(performedBy).forEach(([key, value]) => {
          formData.append(key, value);
        });

        await updateTodo(id, formData);
      } else {
        await updateTodo(id, {
          title,
          description,
          status,
          assignedTo,
          deadline: deadline || null,
          ...performedBy,
        });
      }

      alert("Task Updated Successfully");

      navigate("/tasks", {
        replace: true,
        state: { refresh: true },
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // ==========================
  // Delete Task
  // ==========================
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await deleteTodo(id);

      navigate("/tasks");
    } catch (err) {
      alert(err.message);
    }
  };

  // ==========================
  // Add Comment
  //
  // Admin + Assigned Employee
  // ==========================
  const handleAddComment = async () => {
    if (!comment.trim()) {
      return;
    }

    if (!canComment) {
      setCommentError(
        "You don't have permission to comment on this task."
      );
      return;
    }

    setCommentError("");

    try {
      const updatedTodo = await addTaskComment(id, {
        text: comment.trim(),

        commentedById:
          user?.id || user?._id,

        commentedByName:
          user?.username ||
          user?.name ||
          "User",

        commentedByRole: isAdmin
          ? "admin"
          : "employee",
      });

      setTask(updatedTodo);
      setComment("");
    } catch (err) {
      setCommentError(
        err.message || "Failed to add comment."
      );
    }
  };

  // ==========================
  // Edit Comment
  // ADMIN ONLY
  // ==========================
  const handleEditComment = async (
    commentId,
    currentText
  ) => {
    // Employee can NEVER edit
    if (!isAdmin) {
      return;
    }

    const updatedText = window.prompt(
      "Edit Comment",
      currentText
    );

    if (
      updatedText === null ||
      !updatedText.trim()
    ) {
      return;
    }

    try {
      const updatedTodo =
        await updateTaskComment(
          id,
          commentId,
          {
            text: updatedText.trim(),
            role: user?.role,
            ...getPerformedBy(),
          }
        );

      setTask(updatedTodo);
    } catch (err) {
      setCommentError(
        err.message || "Failed to edit comment."
      );
    }
  };

  // ==========================
  // Delete Comment
  // ADMIN ONLY
  // ==========================
  const handleDeleteComment = async (
    commentId
  ) => {
    // Employee can NEVER delete
    if (!isAdmin) {
      return;
    }

    if (
      !window.confirm(
        "Delete this comment?"
      )
    ) {
      return;
    }

    try {
      const updatedTodo =
        await deleteTaskComment(
          id,
          commentId,
          user?.role,
          user?.id || user?._id || "",
          user?.username || user?.name || ""
        );

      setTask(updatedTodo);
    } catch (err) {
      setCommentError(
        err.message || "Failed to delete comment."
      );
    }
  };

  // ==========================
  // Loading
  // ==========================
  if (!task) {
    return <h3>Loading...</h3>;
  }

  // ==========================
  // View Permission
  //
  // Admin: hamesha dekh sakta hai
  // Employee: sirf tab dekh sakta hai jab wo is task mein
  // abhi bhi assigned ho. Agar usay task se remove kar diya
  // gaya hai, to ye page bhi ab uske liye band ho jata hai
  // (sirf comment hi nahi, poora view bhi restricted hai).
  // ==========================
  const canView = isAdmin || isAssignedEmployee;

  if (!canView) {
    return (
      <div className="todo-form">
        <h2>Task Details</h2>
        <p className="no-comments">
          You don't have permission to view this task.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/tasks")}
        >
          Back
        </button>
      </div>
    );
  }

  const comments = task.comments || [];
  const logs = task.logs || [];

  return (
    <div className="todo-form">

      {/* ==================================================
          TOP TASK ACTIONS
          Small buttons placed at the top.
          Existing task functionality is unchanged.
      ================================================== */}
      {/* ==================================================
    TOP TASK ACTIONS
    Same size as Logout button
================================================== */}
{!isEdit && (
  <div className="task-top-actions">

    {isAdmin && (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          navigate(`/admin/tasks/edit/${id}`)
        }
      >
        Edit
      </button>
    )}

    {isAdmin && (
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleDelete}
      >
        Delete
      </button>
    )}

    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => navigate("/tasks")}
    >
      Back
    </button>

  </div>
)}
      <h2>
        {isEdit
          ? "Edit Task"
          : "Task Details"}
      </h2>

      {/* ==========================
          TASK DETAILS
      ========================== */}

      <div className="employee-view-grid">

        {/* TITLE */}
        <div className="employee-view-field">
          <strong>Title</strong>

          {isEdit ? (
            <input
              className="todo-input"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          ) : (
            <p>{task.title}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="employee-view-field">
          <strong>
            Description
          </strong>

          {isEdit ? (
            <textarea
              className="todo-textarea"
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          ) : (
            <p>
              {task.description}
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className="employee-view-field">
          <strong>Status</strong>

          {isEdit ? (
            <select
              className="status-select"
              value={status}
              onChange={handleStatusChange}
            >
              {statusOptionsForUser.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <p>
              {task.status}
            </p>
          )}
        </div>

        {/* ASSIGNED TO */}
        <div className="employee-view-field">
          <strong>
            Assigned To
          </strong>

          {isEdit ? (
            <select
              className="status-select assign-multiselect"
              multiple
              value={assignedTo}
              onChange={(e) =>
                setAssignedTo(
                  Array.from(e.target.selectedOptions).map(
                    (option) => option.value
                  )
                )
              }
              title="Ctrl/Cmd + click to select multiple employees"
            >
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          ) : (
            <p>
              {(task.assignedTo || [])
                .map((emp) => emp?.name)
                .filter(Boolean)
                .join(", ") || "-"}
            </p>
          )}
        </div>

        {/* CREATED BY */}
        <div className="employee-view-field">
          <strong>
            Created By
          </strong>

          <p>
            {task.createdBy?.username || "-"}
          </p>
        </div>

        {/* CREATED DATE */}
        <div className="employee-view-field">
          <strong>
            Created Date
          </strong>

          <p>
            {task.createdAt ? formatDate(task.createdAt) : "-"}
          </p>
        </div>

        {/* DEADLINE */}
        <div className="employee-view-field">
          <strong>Deadline</strong>

          {isEdit ? (
            <input
              type="datetime-local"
              className="todo-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          ) : (
            <p>
              {task.deadline ? formatDate(task.deadline) : "-"}
            </p>
          )}
        </div>

        {/* ATTACHMENT */}
        <div className="employee-view-field">
          <strong>Attachment</strong>

          {isEdit ? (
            <>
              <input
                type="file"
                className="todo-input"
                onChange={(e) =>
                  setAttachment(e.target.files?.[0] || null)
                }
              />

              {attachment ? (
                <small className="field-hint">
                  Selected: {attachment.name}
                </small>
              ) : (
                task.attachment?.url && (
                  <small className="field-hint">
                    Current:{" "}
                    <a
                      href={`${FILE_BASE_URL}${task.attachment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {task.attachment.originalName || "Download file"}
                    </a>
                  </small>
                )
              )}
            </>
          ) : (
            <p>
              {task.attachment?.url ? (
                <a
                  href={`${FILE_BASE_URL}${task.attachment.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {task.attachment.originalName || "Download file"}
                </a>
              ) : (
                "-"
              )}
            </p>
          )}
        </div>

      </div>

      <br />

      {/* ==========================
          EDIT TASK
      ========================== */}

      {isEdit ? (
        <>
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate("/tasks")
            }
          >
            Cancel
          </button>
        </>
      ) : null}

      {/* ==================================================
          COMMENTS
      ================================================== */}

      {!isEdit && (
        <div className="employee-comments-section">

          <div className="comments-header">
            <h3>Comments</h3>
          </div>

          {/* ==========================
              COMMENT INPUT
          ========================== */}

          {canComment ? (
            <div className="comment-input-area">

              <textarea
                className="todo-input comment-textarea"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => {
                  setComment(
                    e.target.value
                  );

                  setCommentError("");
                }}
              />

              <button
                type="button"
                className="btn btn-primary comment-add-btn"
                onClick={
                  handleAddComment
                }
              >
                Add Comment
              </button>

            </div>
          ) : (
            <p className="no-comments">
              You don't have permission
              to comment on this task.
            </p>
          )}

          {/* ERROR */}
          {commentError && (
            <span className="field-error">
              {commentError}
            </span>
          )}

          {/* ==========================
              COMMENTS LIST
          ========================== */}

          <div className="comments-list">

            {comments.length === 0 ? (

              <p className="no-comments">
                No comments yet.
              </p>

            ) : (

              comments
                .slice()
                .reverse()
                .map((item) => (

                  <div
                    className="comment-card"
                    key={item._id}
                  >

                    <div className="comment-top">

                      <strong>
                        {item.commentedByName}
                      </strong>

                      <span className="comment-role-badge">
                        {item.commentedByRole}
                      </span>

                    </div>

                    <p className="comment-text">
                      {item.text}
                    </p>

                    <small>
                      {formatDate(
                        item.createdAt
                      )}
                    </small>

                    {/* ==========================
                        ADMIN ONLY
                        EDIT + DELETE
                    ========================== */}

                    {isAdmin && (
                      <div className="comment-actions">

                        <button
                          type="button"
                          className="comment-edit-btn"
                          onClick={() =>
                            handleEditComment(
                              item._id,
                              item.text
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="comment-delete-btn"
                          onClick={() =>
                            handleDeleteComment(
                              item._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    )}

                    {/* 
                      IMPORTANT:
                      Employee ke liye yahan
                      Edit/Delete buttons nahi hain.
                    */}

                  </div>

                ))

            )}

          </div>

        </div>
      )}

      {/* ==================================================
          ACTIVITY LOG
          Is task ke andar hone wali har action ki history:
          create, edit, status change, assign, comments.
      ================================================== */}

      {!isEdit && (
        <div className="employee-comments-section">

          <div className="comments-header">
            <h3>Activity Log</h3>
          </div>

          <div className="comments-list">

            {logs.length === 0 ? (

              <p className="no-comments">
                No activity yet.
              </p>

            ) : (

              logs
                .slice()
                .reverse()
                .map((item, index) => (

                  <div
                    className="comment-card"
                    key={item._id || index}
                  >

                    <div className="comment-top">

                      <strong>
                        {item.performedByName || "Someone"}
                      </strong>

                      {item.performedByRole && (
                        <span className="comment-role-badge">
                          {item.performedByRole}
                        </span>
                      )}

                    </div>

                    <p className="comment-text">
                      {item.message}
                    </p>

                    <small>
                      {formatDate(item.createdAt)}
                    </small>

                  </div>

                ))

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default TaskView;