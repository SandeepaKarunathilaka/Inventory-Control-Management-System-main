import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const RegisterPage = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]).{8,}$/;

  const sriLankanMobileRegex =
    /^(?:\+94|0)?7[01245678]\d{7}$/;

  const validateField = (
    fieldName,
    value
  ) => {

    let error = "";

    switch (fieldName) {

      case "name":

        if (!value.trim()) {
          error = "Full Name is required";
        }

        else if (
          value.trim().length < 4
        ) {
          error =
            "Name must be at least 4 characters";
        }

        break;

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
          !passwordRegex.test(value)
        ) {
          error =
            "Password must contain letters, numbers and symbols";
        }

        break;

      case "phoneNumber":

        if (!value.trim()) {
          error =
            "Phone Number is required";
        }

        else if (
          !sriLankanMobileRegex.test(
            value
          )
        ) {
          error =
            "Invalid Sri Lankan mobile number";
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

    const isNameValid =
      validateField("name", name);

    const isEmailValid =
      validateField("email", email);

    const isPasswordValid =
      validateField(
        "password",
        password
      );

    const isPhoneValid =
      validateField(
        "phoneNumber",
        phoneNumber
      );

    return (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPhoneValid
    );
  };

  const handleRegister =
    async (e) => {

      e.preventDefault();

      if (!validateForm()) return;

      try {

        const registerData = {
          name: name.trim(),
          email: email.trim(),
          password,
          phoneNumber:
            phoneNumber.trim(),
        };

        await ApiService.registerUser(
          registerData
        );

        setMessage(
          "Registration successful"
        );

        navigate("/login");

      } catch (error) {

        setMessage(
          error.response?.data
            ?.message ||
            "Error registering user"
        );

        console.log(error);
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

          <h2>Register</h2>

          <p className="auth-subtitle">
            Create your Web-Inventory account
          </p>

        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          noValidate
        >

          {/* FULL NAME */}

          <div className="form-group-auth">

            <label>
              Full Name{" "}
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {

                setName(
                  e.target.value
                );

                validateField(
                  "name",
                  e.target.value
                );
              }}
              className={
                errors.name
                  ? "input-error"
                  : ""
              }
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
              </span>
            )}

          </div>

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

            <input
              type="password"
              placeholder="Enter a strong password"
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

          {/* PHONE */}

          <div className="form-group-auth">

            <label>
              Phone Number{" "}
              <span className="required-star">
                *
              </span>
            </label>

            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => {

                setPhoneNumber(
                  e.target.value
                );

                validateField(
                  "phoneNumber",
                  e.target.value
                );
              }}
              className={
                errors.phoneNumber
                  ? "input-error"
                  : ""
              }
            />

            {errors.phoneNumber ? (

              <span className="field-error">
                {errors.phoneNumber}
              </span>

            ) : (

              <span className="password-hint">
                Accepted formats:
                +947XXXXXXXX,
                07XXXXXXXX,
                7XXXXXXXX
              </span>
            )}

          </div>

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default RegisterPage;