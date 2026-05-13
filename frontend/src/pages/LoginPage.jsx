import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const LoginPage = () => {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const navigate = useNavigate();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (
    fieldName,
    value
  ) => {

    let error = "";

    switch (fieldName) {

      case "email":

        if (!value.trim()) {

          error =
            "Email Address is required";
        }

        else if (
          !emailRegex.test(value)
        ) {

          error =
            "Invalid email format";
        }

        break;

      case "password":

        if (!value.trim()) {

          error =
            "Password is required";
        }

        else if (
          value.length < 8
        ) {

          error =
            "Password must be at least 8 characters";
        }

        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  const validateForm = () => {

    const emailValid =
      validateField(
        "email",
        email
      );

    const passwordValid =
      validateField(
        "password",
        password
      );

    return (
      emailValid &&
      passwordValid
    );
  };

  const handleLogin =
    async (e) => {

      e.preventDefault();

      if (!validateForm())
        return;

      try {

        const response =
          await ApiService.loginUser({
            email,
            password,
          });

        if (
          response.status === 200
        ) {

          ApiService.saveToken(
            response.token
          );

          ApiService.saveRole(
            response.role
          );

          setMessage(
            "Login successful"
          );

          navigate("/dashboard");
        }

      } catch (error) {

        console.log(error);

        setMessage(
          error.response?.data
            ?.message ||
            "Invalid email or password"
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

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group-auth">

            <label>
              Email Address{" "}
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {

                setEmail(
                  e.target.value
                );

                validateField(
                  "email",
                  e.target.value
                );
              }}
              className={
                errors.email
                  ? "input-error"
                  : ""
              }
            />

            {errors.email && (

              <span className="field-error">
                {errors.email}
              </span>

            )}

          </div>

          {/* PASSWORD */}

          <div className="form-group-auth">

            <label>
              Password{" "}
              <span className="required-star">
                *
              </span>
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
                  );

                  validateField(
                    "password",
                    e.target.value
                  );
                }}
                className={
                  errors.password
                    ? "input-error"
                    : ""
                }
              />

              <span
                className="show-password-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "HIDE"
                  : "SHOW"}
              </span>

            </div>

            {errors.password ? (

              <span className="field-error">
                {errors.password}
              </span>

            ) : (

              <span className="password-hint">
                Password must be at least 8 characters
              </span>

            )}

          </div>

          <div className="forgot-password-wrap">

            <Link
              to="/forgot-password"
              className="forgot-password-link"
            >
              Forgot Password?
            </Link>

          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p>

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default LoginPage;