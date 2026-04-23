import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const validateLoginForm = () => {
    if (!email.trim()) {
      setFieldError("Email is required.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setFieldError("Please enter a valid email address with @.");
      return false;
    }

    if (!password.trim()) {
      setFieldError("Password is required.");
      return false;
    }

    setFieldError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    try {
      const loginData = {
        email: email.trim(),
        password,
      };

      const res = await ApiService.loginUser(loginData);

      if (res.status === 200) {
        ApiService.saveToken(res.token);
        ApiService.saveRole(res.role);
        showMessage(res.message || "Login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error logging in user: " + error
      );
      console.log(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Web-Inventory Logo" className="auth-logo" />
          <h2>Login</h2>
          <p className="auth-subtitle">Welcome back to Web-Inventory</p>
        </div>

        {message && <p className="message">{message}</p>}
        {fieldError && <p className="error-message">{fieldError}</p>}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group-auth">
            <label htmlFor="login-email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="login-password">
              Password <span className="required-star">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password-wrap">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;