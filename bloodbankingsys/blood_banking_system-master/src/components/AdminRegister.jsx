import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./AdminLogin.css";

const AdminRegister = () => {
  const { setAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    registrationCode: "" // Special code for admin registration
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  // Add field validation
  useEffect(() => {
    // Reset errors when form data changes
    setError("");
    
    // Validate username format
    if (formData.username && formData.username.length < 3) {
      setFieldErrors(prev => ({...prev, username: "Username must be at least 3 characters"}));
    } else if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setFieldErrors(prev => ({...prev, username: "Username can only contain letters, numbers, and underscores"}));
    } else {
      setFieldErrors(prev => ({...prev, username: ""}));
    }
    
    // Validate password strength
    if (formData.password && formData.password.length < 8) {
      setFieldErrors(prev => ({...prev, password: "Password must be at least 8 characters"}));
    } else {
      setFieldErrors(prev => ({...prev, password: ""}));
    }
    
    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setFieldErrors(prev => ({...prev, email: "Please enter a valid email address"}));
    } else {
      setFieldErrors(prev => ({...prev, email: ""}));
    }
  }, [formData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.registrationCode) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    // Check if there are any field validation errors
    if (fieldErrors.username || fieldErrors.email || fieldErrors.password) {
      setError("Please fix the form errors before submitting");
      setLoading(false);
      return;
    }

    try {
      // Log registration data (excluding password)
      console.log("Attempting admin registration with:", {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        registrationCode: formData.registrationCode
      });
      
      // Register admin
      const response = await fetch("http://localhost:8081/api/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          registrationCode: formData.registrationCode // Special code for admin registration
        }),
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log("Admin registration response status:", response.status);
        
      if (!response.ok) {
        let errorMessage = `Registration failed with status: ${response.status}`;
        
        // Handle specific status codes
        if (response.status === 409) {
          // For 409 Conflict, try to get text response since it might not be JSON
          try {
            const errorText = await response.text();
            console.log("Error response text:", errorText);
            
            // Extract specific error details if possible
            if (errorText.includes("username")) {
              errorMessage = "Username already taken. Please choose another username.";
              // Highlight the username field with error
              setFieldErrors(prev => ({...prev, username: "Username already taken"}));
            } else if (errorText.includes("email")) {
              errorMessage = "Email already registered. Please use another email address.";
              // Highlight the email field with error
              setFieldErrors(prev => ({...prev, email: "Email already registered"}));
            } else {
              errorMessage = errorText || "User already exists with the provided username or email";
            }
          } catch (textErr) {
            console.error("Could not read error response text:", textErr);
            errorMessage = "User already exists with the provided username or email";
          }
        } else {
          // For other errors, try to parse as JSON
          try {
            const errorData = await response.json();
            console.error("Error data:", errorData);
            errorMessage = errorData?.message || errorMessage;
          } catch (parseErr) {
            console.error("Could not parse error response:", parseErr);
            // Try to get as text if JSON parsing fails
            try {
              const errorText = await response.text();
              console.log("Error response text:", errorText);
              errorMessage = errorText || errorMessage;
            } catch (textErr) {
              console.error("Could not read error response text:", textErr);
            }
          }
        }
        throw new Error(errorMessage);
      }
        
      const data = await response.json();
      
      setSuccess("Admin registration successful! Redirecting to login...");
      
      // Redirect to admin login after a short delay
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-logo">
            <img src="/blood-drop-logo.svg" alt="Blood Bank Logo" />
          </div>
          <h1>Admin Registration</h1>
          <p>Register to manage blood bank operations</p>
        </div>
        
        <form className="admin-auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              <i className="fas fa-exclamation-circle"></i> {error}
              {error.includes("already exists") && (
                <p className="error-help-text">
                  Try logging in instead or use a different username/email.
                </p>
              )}
            </div>
          )}
          {success && <div className="auth-success"><i className="fas fa-check-circle"></i> {success}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className={fieldErrors.email ? "input-error" : ""}
              />
            </div>
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <i className="fas fa-user-shield"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                className={fieldErrors.username ? "input-error" : ""}
              />
            </div>
            {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon password-input-container">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className={fieldErrors.password ? "input-error" : ""}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="registrationCode">Admin Registration Code</label>
            <div className="input-with-icon">
              <i className="fas fa-key"></i>
              <input
                type="text"
                id="registrationCode"
                name="registrationCode"
                value={formData.registrationCode}
                onChange={handleChange}
                placeholder="Enter special admin registration code"
                required
              />
              <small className="form-text">
                Use code "ADMIN123" to register as administrator
              </small>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Admin"}
          </button>
        </form>
        
        <div className="admin-auth-footer">
          <p>
            Already have an admin account? <Link to="/admin-login">Sign In</Link>
          </p>
          <p>
            Return to <Link to="/">Blood Bank Home</Link>
          </p>
          <p className="security-notice">
            <i className="fas fa-shield-alt"></i> This portal is restricted to authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;