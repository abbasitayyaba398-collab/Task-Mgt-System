


// // src/components/LoginForm.jsx

// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { loginUser } from "../api/loginApi";

// function LoginForm({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!username.trim() || !password.trim()) {
//       alert("Please enter username and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       const result = await loginUser(username, password);

//       alert(result.message || "Login Successful");

//       // Parent component (App.jsx) ko user object pass karein
//       onLogin(result.user);
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2 className="login-title">Login</h2>

//         <input
//           type="text"
//           className="todo-input"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <div className="password-input-wrapper">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="todo-input"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="button"
//             className="password-toggle-btn"
//             onClick={() => setShowPassword((prev) => !prev)}
//             tabIndex={-1}
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary login-btn"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;










// src/components/LoginForm.jsx

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api/loginApi";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser(email.trim(), password);

      alert(result.message || "Login Successful");

      // Parent component (App.jsx) ko user object pass karein
      onLogin(result.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          className="todo-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="todo-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;