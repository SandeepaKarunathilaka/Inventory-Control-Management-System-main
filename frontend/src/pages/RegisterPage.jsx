import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]).{8,}$/;
  const sriLankanMobileRegex = /^(?:\+94|0)?7[01245678]\d{7}$/;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const validateRegisterForm = () => {
    if (!name.trim()) {
      setFieldError("Name is required.");
      return false;
    }

    if (name.trim().length < 4) {
      setFieldError("Name must be more than 3 characters.");
      return false;
    }

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

    if (!passwordRegex.test(password)) {
      setFieldError(
        "Password must be at least 8 characters and include letters, numbers, and symbols."
      );
      return false;
    }

    if (!phoneNumber.trim()) {
      setFieldError("Phone number is required.");
      return false;
    }

    if (!sriLankanMobileRegex.test(phoneNumber.trim())) {
      setFieldError(
        "Enter a valid Sri Lankan mobile number: +947XXXXXXXX, 07XXXXXXXX, or 7XXXXXXXX."
      );
      return false;
    }

    setFieldError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    try {
      const registerData = {
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
      };

      await ApiService.registerUser(registerData);
      showMessage("Registration successful");
      navigate("/login");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error registering user: " + error
      );
      console.log(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Web-Inventory Logo" className="auth-logo" />
          <h2>Register</h2>
          <p className="auth-subtitle">Create your Web-Inventory account</p>
        </div>

        {message && <p className="message">{message}</p>}
        {fieldError && <p className="error-message">{fieldError}</p>}

        <form onSubmit={handleRegister} noValidate>
          <div className="form-group-auth">
            <label htmlFor="register-name">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="register-email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="register-password">
              Password <span className="required-star">*</span>
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="register-phone">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              id="register-phone"
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <p className="input-hint">
            Accepted formats: +947XXXXXXXX, 07XXXXXXXX, 7XXXXXXXX
          </p>

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;