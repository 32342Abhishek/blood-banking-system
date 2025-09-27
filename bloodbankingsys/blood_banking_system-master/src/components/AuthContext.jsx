import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * Decodes a JWT token to extract the payload
 * @param {string} token - JWT token
 * @returns {object} - The decoded token payload
 */
const parseJwt = (token) => {
  try {
    // Get the payload part of the JWT (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user object
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Check if token is expired
        const decodedToken = parseJwt(storedToken);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          // Token is valid
          setLoggedIn(true);
          setToken(storedToken);
          
          // Extract user data from token or use stored data
          const userId = decodedToken.userId || localStorage.getItem('userId');
          const role = decodedToken.role || localStorage.getItem('userRole');
          const name = localStorage.getItem('userName');
          const email = decodedToken.sub; // 'sub' is the subject claim, typically the username/email
          
          setUser({ id: userId, name, email, role });
        } else {
          // Token is expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
        }
      }
      
      setIsLoading(false);
    };
    
    checkLoginStatus();
  }, []);

  // Logout function to clear auth state
  const logout = () => {
    setLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };
  
  // Function to check and refresh token if needed
  const refreshTokenIfNeeded = async () => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      console.log("No token to refresh");
      return false;
    }
    
    // Try to decode the token to check expiry
    try {
      const parts = storedToken.trim().split('.');
      if (parts.length !== 3) {
        console.error("Invalid token format");
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const expiry = payload.exp ? new Date(payload.exp * 1000) : null;
      
      // If token expires in less than 5 minutes, try to refresh it
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      
      if (!expiry || expiry < fiveMinutesFromNow) {
        console.log("Token expired or expiring soon, attempting to refresh...");
        
        try {
          // Call refresh token endpoint
          const response = await fetch("http://localhost:8081/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${storedToken.trim()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              // Update token
              setAuthData({
                token: data.token,
                userId: user?.id || localStorage.getItem('userId'),
                name: user?.name || localStorage.getItem('userName'),
                role: user?.role || localStorage.getItem('userRole')
              });
              console.log("Token refreshed successfully");
              return true;
            }
          } else {
            console.error("Failed to refresh token:", response.status);
            if (response.status === 401) {
              // Token is completely invalid, log out
              logout();
            }
            return false;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          return false;
        }
      }
      
      return true; // Token is still valid
    } catch (error) {
      console.error("Error checking token:", error);
      return false;
    }
  };

  // Helper function to set authentication data
  const setAuthData = (authData) => {
    if (authData && authData.token) {
      console.log("Setting auth data - User role:", authData.role);
      
      // Ensure token is properly formatted - remove quotes and whitespace
      let cleanToken = authData.token.trim();
      if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
        cleanToken = cleanToken.slice(1, -1).trim();
        console.log("Removed quotes from token");
      }
      
      // Verify this is a valid JWT token (should have 3 parts separated by periods)
      const parts = cleanToken.split('.');
      if (parts.length !== 3) {
        console.error("Invalid JWT token format. Token should have 3 parts separated by periods.");
        return false;
      }
      
      console.log("Token received:", cleanToken.substring(0, Math.min(20, cleanToken.length)) + "...");
      console.log("Token length:", cleanToken.length);
      
      // Try to decode the token to verify it's valid
      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log("Token payload:", payload);
        
        // Check if the token has proper permissions
        if (!payload.role) {
          console.warn("Token does not contain role information");
        } else if (payload.role !== authData.role) {
          console.warn(`Token role (${payload.role}) doesn't match user role (${authData.role})`);
        }
      } catch (error) {
        console.error("Error decoding token payload:", error);
      }
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('userId', authData.userId);
      localStorage.setItem('userName', authData.name);
      localStorage.setItem('userRole', authData.role);
      localStorage.setItem('loginTimestamp', Date.now().toString());
      
      // Update the state
      setToken(cleanToken);
      setUser({
        id: authData.userId,
        name: authData.name,
        email: authData.email,
        role: authData.role
      });
      setLoggedIn(true);
      
      // Verify the token was saved correctly
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error("Failed to save token to localStorage");
        return false;
      }
      
      console.log("Verified stored token exists in localStorage, length:", storedToken.length);
      
      // Make a test API call to verify the token is valid
      setTimeout(() => {
        fetch("http://localhost:8081/api/health", {
          headers: {
            "Authorization": `Bearer ${storedToken}`
          }
        })
        .then(response => {
          console.log("Token validation test response:", response.status);
        })
        .catch(err => {
          console.error("Token validation test failed:", err);
        });
      }, 500);
      
      return true;
    } else {
      console.error("Invalid auth data received:", authData);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        loggedIn, 
        setLoggedIn, 
        user, 
        setUser, 
        token, 
        setToken,
        setAuthData,
        logout,
        isLoading,
        refreshTokenIfNeeded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
