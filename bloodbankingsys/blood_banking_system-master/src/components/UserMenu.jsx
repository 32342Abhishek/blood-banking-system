import React, { useContext, useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaUserShield } from "react-icons/fa";
import { AuthContext } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserMenu = () => {
  const { setLoggedIn, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Check if user is admin (in a real app, you would get this from the user's role)
  const isAdmin = user?.role === 'ADMIN' || localStorage.getItem('userRole') === 'ADMIN';

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('userRole');
    navigate("/");
  };
  
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div 
        className="user-menu-header" 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12,
          cursor: "pointer" 
        }}
      >
        <FaUserCircle style={{ fontSize: 30, color: "#1976d2" }} title={user?.name} />
        <span style={{ fontWeight: 600, color: "#222" }}>{user?.name}</span>
        <FaChevronDown style={{ fontSize: 14, color: "#555" }} />
      </div>
      
      {menuOpen && (
        <div className="user-menu-dropdown" style={{
          position: "absolute",
          top: "100%",
          right: 0,
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderRadius: "4px",
          padding: "10px 0",
          zIndex: 1000,
          minWidth: "200px"
        }}>
          {isAdmin && (
            <div className="admin-links">
              <div style={{ 
                padding: "5px 15px", 
                color: "#555", 
                fontSize: "14px",
                fontWeight: "bold",
                borderBottom: "1px solid #eee"
              }}>
                <FaUserShield style={{ marginRight: "8px" }} />
                Admin Options
              </div>
              <Link 
                to="/admin" 
                style={{ 
                  display: "block", 
                  padding: "8px 15px", 
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px"
                }}
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
              <Link 
                to="/inventory" 
                style={{ 
                  display: "block", 
                  padding: "8px 15px", 
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px"
                }}
                onClick={() => setMenuOpen(false)}
              >
                Blood Inventory
              </Link>
              <Link 
                to="/appointments" 
                style={{ 
                  display: "block", 
                  padding: "8px 15px", 
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px"
                }}
                onClick={() => setMenuOpen(false)}
              >
                Appointments
              </Link>
            </div>
          )}
          
          <div style={{ 
            padding: "8px 15px", 
            color: "#e63946", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderTop: isAdmin ? "1px solid #eee" : "none"
          }} onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
