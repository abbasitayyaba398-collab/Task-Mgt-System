

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function EmployeeForm({
  user,
  initialData,
  onSave,
  onCancel,
}) {
  const isEditMode = Boolean(initialData);

  // =========================================
  // EMPLOYEE FIELDS
  // =========================================

  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");

  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [cnic, setCnic] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  // =========================================
  // VALIDATION
  // =========================================

  const [errors, setErrors] = useState({});

  // =========================================
  // GET CREATOR NAME
  // =========================================

  const getCreatorName = () => {
    if (!user) return "";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      user.email ||
      ""
    );
  };

  // =========================================
  // PREFILL DATA
  // =========================================

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");

      setRole(
        initialData.role || "employee"
      );

      setContactNumber(
        initialData.contactNumber || ""
      );

      setEmail(
        initialData.email || ""
      );

      // Password never prefilled
      setPassword("");

      setCnic(
        initialData.cnic || ""
      );

      setDob(
        initialData.dob
          ? initialData.dob.substring(0, 10)
          : ""
      );

      setAddress(
        initialData.address || ""
      );
    } else {
      setName("");
      setRole("employee");
      setContactNumber("");
      setEmail("");
      setPassword("");
      setCnic("");
      setDob("");
      setAddress("");
    }

    setErrors({});
  }, [initialData]);

  // =========================================
  // VALIDATION
  // =========================================

  const validate = () => {
    const newErrors = {};

    // Employee Name
    if (!name.trim()) {
      newErrors.name =
        "Employee name is required";
    }

    // Role
    if (!role) {
      newErrors.role =
        "Role is required";
    }

    // Contact Number
    if (!contactNumber.trim()) {
      newErrors.contactNumber =
        "Contact number is required";
    } else if (
      !/^\d{11}$/.test(contactNumber)
    ) {
      newErrors.contactNumber =
        "Contact number must contain 11 digits";
    }

    // Email
    if (!email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // Password
    if (!isEditMode && !password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (
      password &&
      password.trim().length < 4
    ) {
      newErrors.password =
        "Password must be at least 4 characters";
    }

    // CNIC
    if (!cnic.trim()) {
      newErrors.cnic =
        "CNIC is required";
    } else if (
      !/^\d{13}$/.test(cnic)
    ) {
      newErrors.cnic =
        "CNIC must contain 13 digits";
    }

    // DOB
    if (!dob) {
      newErrors.dob =
        "Date of Birth is required";
    }

    // Address
    if (!address.trim()) {
      newErrors.address =
        "Address is required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================================
  // SUBMIT EMPLOYEE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Current logged-in user ID
    const creatorId =
      user?._id ||
      user?.id ||
      "";

    // Current logged-in user NAME
    const creatorName =
      getCreatorName();

    const employeeData = {
      name: name.trim(),

      // Employee/Admin role
      role: role,

      contactNumber:
        contactNumber.trim(),

      email:
        email.trim(),

      cnic:
        cnic.trim(),

      dob,

      address:
        address.trim(),

      // Creator ID
      createdBy:
        initialData?.createdBy ||
        creatorId,

      // Creator NAME
      createdByName:
        initialData?.createdByName ||
        creatorName,
    };

    // Password only send when entered
    if (password.trim()) {
      employeeData.password =
        password.trim();
    }

    console.log(
      "Sending Employee Data:",
      employeeData
    );

    try {
      await onSave(employeeData);

      // Clear after successful CREATE
      if (!isEditMode) {
        setName("");
        setRole("employee");
        setContactNumber("");
        setEmail("");
        setPassword("");
        setCnic("");
        setDob("");
        setAddress("");
        setShowPassword(false);
      } else {
        setPassword("");
        setShowPassword(false);
      }
    } catch (err) {
      console.error(
        "Failed to save employee:",
        err
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <form
      className="todo-form employee-form"
      onSubmit={handleSubmit}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="todo-form-header">
        <h2>
          {isEditMode
            ? "Edit Employee"
            : "Add Employee"}
        </h2>
      </div>

      {/* =====================================
          EMPLOYEE FORM
      ===================================== */}

      <div className="employee-form-grid">

        {/* Employee Name */}

        <div className="form-group">
          <label>
            Employee Name
          </label>

          <input
            className="todo-input"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {errors.name && (
            <span className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        {/* Role */}

        <div className="form-group">
          <label>
            Role
          </label>

          <select
            className="todo-input"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="employee">
              Employee
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          {errors.role && (
            <span className="field-error">
              {errors.role}
            </span>
          )}
        </div>

        {/* Contact Number */}

        <div className="form-group">
          <label>
            Contact Number
          </label>

          <input
            className="todo-input"
            type="text"
            placeholder="03XXXXXXXXX"
            value={contactNumber}
            maxLength={11}
            onChange={(e) => {
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setContactNumber(value);
            }}
          />

          {errors.contactNumber && (
            <span className="field-error">
              {errors.contactNumber}
            </span>
          )}
        </div>

        {/* Email */}

        <div className="form-group">
          <label>
            Email
          </label>

          <input
            className="todo-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {errors.email && (
            <span className="field-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}

        <div className="form-group">
          <label>
            {isEditMode
              ? "Password (leave blank to keep unchanged)"
              : "Password"}
          </label>

          <div className="password-input-wrapper">
            <input
              className="todo-input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder={
                isEditMode
                  ? "Enter new password (optional)"
                  : "Enter password"
              }
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              tabIndex={-1}
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}
        </div>

        {/* CNIC */}

        <div className="form-group">
          <label>
            Employee CNIC
          </label>

          <input
            className="todo-input"
            type="text"
            placeholder="XXXXXXXXXXXXX"
            value={cnic}
            maxLength={13}
            onChange={(e) => {
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setCnic(value);
            }}
          />

          {errors.cnic && (
            <span className="field-error">
              {errors.cnic}
            </span>
          )}
        </div>

        {/* Date of Birth */}

        <div className="form-group">
          <label>
            Date of Birth
          </label>

          <input
            className="todo-input"
            type="date"
            value={dob}
            onChange={(e) =>
              setDob(e.target.value)
            }
            max={
              new Date()
                .toISOString()
                .split("T")[0]
            }
          />

          {errors.dob && (
            <span className="field-error">
              {errors.dob}
            </span>
          )}
        </div>

        {/* Address */}

        <div className="form-group">
          <label>
            Employee Address
          </label>

          <input
            className="todo-input"
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
          />

          {errors.address && (
            <span className="field-error">
              {errors.address}
            </span>
          )}
        </div>

        </div>

      {/* =====================================
          BUTTONS
      ===================================== */}

      <div className="todo-form-footer">

        <button
          type="submit"
          className="btn btn-primary create-btn"
        >
          {isEditMode
            ? "Update"
            : "Save"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

      </div>
    </form>
  );
}

export default EmployeeForm;