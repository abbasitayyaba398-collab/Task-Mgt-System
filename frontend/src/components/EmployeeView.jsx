





// frontend/src/components/EmployeeView.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchEmployeeById } from "../api/employeeApi";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString();
}

function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadEmployee();
  }, [id]);

  if (error) {
    return (
      <div>
        <div className="error-banner">{error}</div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/employees")}
        >
          Back
        </button>
      </div>
    );
  }

  if (!employee) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="todo-form employee-view">

      <div className="todo-form-header">
        <h2>Employee Details</h2>
      </div>

      <div className="employee-view-grid">

        <div className="employee-view-field">
          <span className="employee-view-label">Employee Name</span>
          <span className="employee-view-value">{employee.name}</span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">Username</span>
          <span className="employee-view-value">{employee.username || "-"}</span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">Contact Number</span>
          <span className="employee-view-value">{employee.contactNumber}</span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">Email ID</span>
          <span className="employee-view-value">{employee.email}</span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">CNIC</span>
          <span className="employee-view-value">{employee.cnic}</span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">Created Date</span>
          <span className="employee-view-value">
            {formatDate(employee.createdAt)}
          </span>
        </div>

        <div className="employee-view-field">
          <span className="employee-view-label">Updated Date</span>
          <span className="employee-view-value">
            {formatDate(employee.updatedAt)}
          </span>
        </div>
           
    
        
              <div className="employee-view-field">
          <span className="employee-view-label">DOB</span>
          <span className="employee-view-value">
            {formatDate(employee.dob)}
          </span>
        </div>
       



           

        <div className="employee-view-field">
          <span className="employee-view-label">Employee Address</span>
          <span className="employee-view-value">{employee.address}</span>
        </div>
           
      </div>

      <div className="todo-form-footer">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/employees")}
        >
          Back
        </button>
      </div>

    </div>
  );
}

export default EmployeeView;