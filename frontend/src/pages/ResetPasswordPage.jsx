import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]).{8,}$/;

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

    if (!otp.trim()) {
      setFieldError("OTP is required.");
      return false;
    }

    if (otp.trim().length !== 6) {
      setFieldError("OTP must be 6 digits.");
      return false;
    }

    if (!newPassword.trim()) {
      setFieldError("New password is required.");
      return false;
    }

    if (!passwordRegex.test(newPassword)) {
      setFieldError(
        "Password must be at least 8 characters and include letters, numbers, and symbols."
      );
      return false;
    }

    if (!confirmPassword.trim()) {
      setFieldError("Confirm password is required.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match.");
      return false;
    }

    setFieldError("");
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await ApiService.verifyResetOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      const res = await ApiService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      showMessage(res.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setFieldError(
        error.response?.data?.message || "Error resetting password: " + error.message
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Web-Inventory Logo" className="auth-logo" />
          <h2>Reset Password</h2>
          <p className="auth-subtitle">
            Enter the OTP and create your new password
          </p>
        </div>

        {message && <p className="message">{message}</p>}
        {fieldError && <p className="error-message">{fieldError}</p>}

        <form onSubmit={handleResetPassword} noValidate>
          <div className="form-group-auth">
            <label htmlFor="reset-email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="reset-otp">
              OTP Code <span className="required-star">*</span>
            </label>
            <input
              id="reset-otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="new-password">
              New Password <span className="required-star">*</span>
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="confirm-password">
              Confirm Password <span className="required-star">*</span>
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Reset Password</button>
        </form>

        <p>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;