import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const { setAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (email && password) {
        console.log("Attempting login for:", email);
        
        const response = await fetch("http://localhost:8081/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
          mode: 'cors',
          credentials: 'omit' // Changed from 'include' to 'omit' to avoid CORS issues
        });
        
        // Log the response for debugging
        console.log("Login response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Invalid credentials");
        }
        
        const data = await response.json();
        console.log("Login successful, received data:", { 
          role: data.role, 
          tokenReceived: !!data.token,
          tokenLength: data.token ? data.token.length : 0
        });
        
        // Validate that we received a token
        if (!data.token) {
          throw new Error("No token received from server");
        }
        
        // Use the setAuthData function from context to store token and user info
        const success = setAuthData(data);
        
        if (success) {
          console.log(`Authentication successful, redirecting to ${data.role === "ADMIN" ? "/admin" : "/"}`);
          
          // Redirect based on role
          if (data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          throw new Error("Failed to process login response");
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account and save lives through blood donation.</p>
            </div>
          </div>
          
          <div className="auth-card-right">
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2>Sign In</h2>
              
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
              
              <div className="auth-footer">
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
