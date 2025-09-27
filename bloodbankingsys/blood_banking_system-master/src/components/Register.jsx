import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "./AuthContext";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name && bloodType && email && password) {
      setError("");
      setLoading(true);
      
      try {
        console.log("Attempting registration with:", { name, email, bloodType });
        
        // First try to check if the backend is accessible
        try {
          const pingResponse = await fetch("http://localhost:8081/api/test/ping", {
            method: "GET",
            mode: 'cors',
            credentials: 'include'
          });
          console.log("Backend ping status:", pingResponse.status);
        } catch (pingErr) {
          console.error("Backend ping failed:", pingErr);
        }
        
        // Call backend API with explicit mode
        const response = await fetch("http://localhost:8081/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            name,
            email,
            password,
            bloodType
          }),
        }).catch(err => {
          console.error("Network error during fetch:", err);
          throw new Error("Server connection failed. Is the backend running at http://localhost:8081?");
        });
        
        console.log("Registration response status:", response.status);
        
        if (!response.ok) {
          let errorMessage = `Registration failed with status: ${response.status}`;
          try {
            const errorData = await response.json();
            console.error("Error data:", errorData);
            errorMessage = errorData?.message || errorMessage;
          } catch (parseErr) {
            console.error("Could not parse error response:", parseErr);
          }
          throw new Error(errorMessage);
        }
        
        // Parse the successful response
        const data = await response.json().catch(err => {
          console.error("Error parsing response:", err);
          throw new Error("Could not process server response");
        });
        
        console.log("Registration successful, received:", data);        
        if (data.token) {
          // Use the AuthContext's setAuthData function to store token and user info
          const success = setAuthData(data);
          
          if (success) {
            // Navigate to donor page
            navigate("/donar");
          } else {
            throw new Error("Failed to process registration response");
          }
        } else {
          // Registration successful but no auto-login
          alert("Registration Successful! Please login.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError(err.message || "Registration failed. Please try again.");
        
        // Show detailed diagnostics if it's a network error
        if (err.message && err.message.includes("connection failed")) {
          setError(
            "Connection error: Could not reach the server at http://localhost:8081. " +
            "Please ensure the backend server is running and check your network connection."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-left">
            <div className="auth-brand">
              <img src="/blood-drop-logo.svg" alt="Life Savers" className="auth-logo" />
              <h1>Life Savers</h1>
            </div>
            <div className="auth-message">
              <h2>Join Our Community</h2>
              <p>Register to become a blood donor and help save lives. Your contribution matters.</p>
            </div>
          </div>
          
          <div className="auth-card-right">
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2>Create Account</h2>
              
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type</label>
                <select 
                  id="bloodType"
                  value={bloodType} 
                  onChange={(e) => setBloodType(e.target.value)}
                  required
                >
                  <option value="">Select your blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
              
              <div className="auth-footer">
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
