import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await ApiService.loginUser({
        email,
        password,
      });

      if (response.status === 200) {
        ApiService.saveToken(response.token);
        ApiService.saveRole(response.role);

        setMessage("Login successful");

        if (response.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-brand">
          <img
            src="/logo.png"
            alt="Web-Inventory Logo"
            className="auth-logo"
          />

          <h2>Login</h2>

          <p className="auth-subtitle">
            Welcome back to Web-Inventory
          </p>
        </div>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group-auth">
            <label>
              Email Address <span className="required-star">*</span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group-auth">
            <label>
              Password <span className="required-star">*</span>
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div
              style={{
                marginTop: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#0f766e",
                userSelect: "none",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#0f766e",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;