// frontend/src/components/Login.jsx

import { useState } from "react";

// Login is a simple, frontend-only gate screen.
// It does NOT talk to any backend or verify real credentials — it only
// checks that both fields are non-empty, then tells the parent (App.jsx)
// that login "succeeded" via the onLogin callback prop.
function Login({ onLogin }) {
  // Controlled input state for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Holds a validation error message, or null when there's nothing to show
  const [error, setError] = useState(null);

  // Runs when the Login form is submitted (button click or pressing Enter)
  const handleSubmit = (e) => {
    // Prevent the browser's default full-page-reload form behavior
    e.preventDefault();

    // ------------------------------------------------------
    // Validation — both fields must be filled (not just whitespace)
    // ------------------------------------------------------
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password to continue.");
      return;
    }

    // Clear any previous error once validation passes
    setError(null);

    // Notify the parent component that login succeeded.
    // No credentials are sent anywhere or persisted — this is purely a
    // frontend gate, as required (no backend/auth yet).
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Application title, shown at the top of the login screen */}
        <h1 className="login-title">📝 My Todo App</h1>
        <p className="login-subtitle">Sign in to manage your tasks</p>

        {/* Show a friendly error message if validation fails */}
        {error && <div className="error-banner login-error">⚠️ {error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username field */}
          <div className="login-field">
            <label className="login-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="todo-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="todo-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login button — reuses the existing .btn / .btn-primary styles
              from the Todo form, so it matches the app's look exactly */}
          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;