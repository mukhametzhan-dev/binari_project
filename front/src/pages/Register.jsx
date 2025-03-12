import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("Easy");

  // Simple password strength checker
  const checkPasswordStrength = (password) => {
    let strengthScore = 0;

    if (password.match(/[A-Z]/)) strengthScore++;
    if (password.match(/\d/)) strengthScore++;
    if (password.length >= 10) strengthScore++;

    if (strengthScore <= 1) return "Easy";
    if (strengthScore === 2) return "Medium";
    return "Hard";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Update password strength as user types the password
    if (id === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Force user to have at least Medium password strength
    if (passwordStrength === "Easy") {
      setModal({
        show: true,
        title: "Weak Password",
        message: "Your password must be at least Medium strength.",
      });
      return;
    }
    // Additional password match check (optional)
    if (formData.password !== formData.password2) {
      setModal({
        show: true,
        title: "Password Mismatch",
        message: "Please ensure both passwords match.",
      });
      return;
    }
    if(formData.password.length < 8 ){
        setModal({
            show: true,
            title: "Password Length",
            message: "Password must be at least 8 characters.",
        });
        return;
        }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );
      if (response.status === 201) {
        setModal({
          show: true,
          title: "Registration Successful",
          message: "You have successfully registered",
        });
      } else if (response.status === 400) {
        setModal({
          show: true,
          title: "Registration Failed",
          message: "Please check your details and try again: " + response.data,
        });
      }
    } catch (error) {
      console.error(error);
      setModal({
        show: true,
        title: "Error",
        message: "An error occurred. Please try again later.",
      });
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="username">UserName</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter Your Name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Strength: <strong>{passwordStrength}</strong>
                </small>
              </div>
              <div className="form my-3">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="my-3">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-underline text-info"
                  >
                    Login
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {modal.show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modal.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;