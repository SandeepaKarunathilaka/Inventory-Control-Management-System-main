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

    if (!validateLoginForm()) {
      return;
    }

    try {
      const loginData = {
        email: email.trim(),
        password,
      };

      const res = await ApiService.loginUser(loginData);

      console.log(res);

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

  const handleForgotPassword = () => {
    showMessage("Forgot password feature will be added next.");
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
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password-wrap">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
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