
// frontend/src/components/EmployeeTable.jsx

import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function EmployeeTable({ employees, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmed) {
      onDelete(id);
    }
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Employees Found</h3>
      </div>
    );
  }

  return (
    <div className="todo-table-container">
      <table className="todo-table">

        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Employee Name</th>
            <th>UserName</th>
            <th>UserRole</th>
            <th>Contact Number</th>
            <th>Email ID</th>
            <th>CNIC</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>

              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.username || "-"}</td>
              <td>{employee.role || "-"}</td>
              <td>{employee.contactNumber}</td>
              <td>{employee.email}</td>
              <td>{employee.cnic}</td>
              <td>{formatDate(employee.createdAt)}</td>

              <td>
                <div className="actions-cell">

                 <button
                 className="btn btn-secondary icon-btn"
                 onClick={() =>
                navigate(`/admin/employees/view/${employee._id}`)
             }
              >
             <FaEye />
            </button>
           <button
              className="btn btn-edit icon-btn"
             onClick={() =>
              navigate(`/admin/employees/edit/${employee._id}`)
           }
               >
            <FaEdit />
               </button>

                  <button
                  className="btn btn-danger icon-btn"
                   onClick={() => handleDelete(employee._id)}
                       >
                    <FaTrash />
                   </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default EmployeeTable;