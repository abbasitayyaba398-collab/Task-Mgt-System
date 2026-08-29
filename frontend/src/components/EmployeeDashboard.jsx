
// frontend/src/components/EmployeeDashboard.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";

import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeApi";

function EmployeeDashboard({ user, showForm = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // Load Employees
  // ==========================
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const data = await fetchEmployees();

      setEmployees(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Employee for Edit
  // ==========================
  useEffect(() => {
    if (!id) {
      setEditingEmployee(null);
      return;
    }

    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id);
        setEditingEmployee(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadEmployee();
  }, [id]);

  // ==========================
  // Save Employee
  // ==========================
  const handleSave = async (employeeData) => {
    try {
      if (isEditMode) {
        await updateEmployee(id, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      await loadEmployees();

      // Save ke baad Employees page
      navigate("/employees");

    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================
  // Delete Employee
  // ==========================
  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);

      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== employeeId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================
  // Cancel
  // ==========================
  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Add Employee Page */}
      {showForm && (
        <EmployeeForm
          user={user}
          initialData={editingEmployee}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Employees Page */}
      {!showForm && (
        loading ? (
          <h3>Loading...</h3>
        ) : (
          <EmployeeTable
            employees={employees}
            onDelete={handleDelete}
          />
        )
      )}

    </div>
  );
}

export default EmployeeDashboard;