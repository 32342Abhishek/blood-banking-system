import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { API_BASE_URL, ENDPOINTS } from "../utils/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { setAuthData } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (username && password) {
        console.log("Attempting admin login for:", username);
        
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_LOGIN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            username,
            password,
          }),
          mode: 'cors',
          credentials: 'omit' // Changed from 'include' to 'omit' to avoid CORS issues
        });
        
        console.log("Admin login response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = null;
          }
          
          throw new Error(errorData?.message || `Authentication failed (${response.status})`);
        }
        
        const data = await response.json();
        console.log("Login successful, received role:", data.role);
        
        // Validate that the user is an admin
        if (data.role !== "ADMIN") {
          throw new Error("Unauthorized: Admin access only");
        }
        
        // Validate token is present
        if (!data.token) {
          throw new Error("No token received from server");
        }
        
        console.log("Token received successfully");
        
        // Use the setAuthData function from context to store token and user info
        const success = setAuthData(data);
        
        if (success) {
          console.log("Authentication data stored successfully");
          navigate("/admin");
        } else {
          throw new Error("Failed to save authentication data");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
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
          <h1>Admin Portal</h1>
          <p>Sign in to manage blood bank operations</p>
        </div>
        
        <form className="admin-auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your admin username"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        
        <div className="admin-auth-footer">
          <p>
            Need an admin account? <Link to="/admin-register">Register</Link>
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

export default AdminLogin;