// import { useState } from "react";

// function TodoForm({ onAddTodo, user }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       alert("Task title is required");
//       return;
//     }

//     onAddTodo({
//       title: title.trim(),
//       description: description.trim(),
//       createdBy: user._id || user.id,
//     });

//     setTitle("");
//     setDescription("");
//   };

//   return (
//     <div className="todo-form-container">
//       <form className="todo-form" onSubmit={handleSubmit}>

//         <div className="todo-form-header">
//           <h2>Create Task</h2>

          
//         </div>

//         <div className="form-group">
//           <label>Task Title</label>

//           <input
//             type="text"
//             className="todo-input"
//             placeholder="Enter task title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Description</label>

//           <textarea
//             className="todo-textarea"
//             rows="4"
//             placeholder="Enter task description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary create-btn"
//         >
//           Create Task
//         </button>

//       </form>
//     </div>
//   );
// }

// export default TodoForm;



import { useState } from "react";

function TodoForm({ onAddTodo, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Deadline — ek hi input se date aur time dono milte hain
  const [deadline, setDeadline] = useState("");

  // Attachment — optional file
  const [attachment, setAttachment] = useState(null);

  const handleFileChange = (e) => {
    setAttachment(e.target.files?.[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    // ==========================
    // FormData use kar rahe hain kyunke file (attachment)
    // multipart/form-data ke bina nahi bheji ja sakti.
    // ==========================
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("createdBy", user._id || user.id);

    if (deadline) {
      formData.append("deadline", deadline);
    }

    if (attachment) {
      formData.append("attachment", attachment);
    }

    onAddTodo(formData);

    setTitle("");
    setDescription("");
    setDeadline("");
    setAttachment(null);
    e.target.reset();
  };

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleSubmit}>

        <div className="todo-form-header">
          <h2>Create Task</h2>


        </div>

        <div className="form-group">
          <label>Task Title</label>

          <input
            type="text"
            className="todo-input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            className="todo-textarea"
            rows="4"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* ==========================
            DEADLINE (Date + Time)
        ========================== */}
        <div className="form-group">
          <label>Deadline</label>

          <input
            type="datetime-local"
            className="todo-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* ==========================
            ATTACHMENT (optional file)
        ========================== */}
        <div className="form-group">
          <label>Attachment (optional)</label>

          <input
            type="file"
            className="todo-input"
            onChange={handleFileChange}
          />

          {attachment && (
            <small className="field-hint">
              Selected: {attachment.name}
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary create-btn"
        >
          Create Task
        </button>

      </form>
    </div>
  );
}

export default TodoForm;