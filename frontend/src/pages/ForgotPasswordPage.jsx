import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
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

  const validateForm = () => {
    if (!email.trim()) {
      setFieldError("Email is required.");
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setFieldError("Please enter a valid email address.");
      return false;
    }

    setFieldError("");
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await ApiService.forgotPassword(email.trim());
      showMessage(res.message || "OTP sent successfully.");

      setTimeout(() => {
        navigate("/reset-password", { state: { email: email.trim() } });
      }, 1000);
    } catch (error) {
      setFieldError(
        error.response?.data?.message || "Error sending OTP: " + error.message
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Web-Inventory Logo" className="auth-logo" />
          <h2>Forgot Password</h2>
          <p className="auth-subtitle">
            Enter your email to receive a password reset OTP
          </p>
        </div>

        {message && <p className="message">{message}</p>}
        {fieldError && <p className="error-message">{fieldError}</p>}

        <form onSubmit={handleSendOtp} noValidate>
          <div className="form-group-auth">
            <label htmlFor="forgot-email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Send OTP</button>
        </form>

        <p>
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;