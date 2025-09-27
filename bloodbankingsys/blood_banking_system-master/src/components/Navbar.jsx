import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { loggedIn, logout, user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/blood-drop-logo.svg" alt="BLOOD" />
          <span className="navbar-title">BLOOD BANK</span>
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about-us" 
            className={`navbar-item ${location.pathname === '/about-us' ? 'active' : ''}`}
          >
            About Us
          </Link>
          <Link 
            to="/services" 
            className={`navbar-item ${location.pathname === '/services' ? 'active' : ''}`}
          >
            Services
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-item ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact Us
          </Link>
          <Link 
            to="/blood-compatibility" 
            className={`navbar-item ${location.pathname === '/blood-compatibility' ? 'active' : ''}`}
          >
            Compatibility
          </Link>
          <Link 
            to="/donation-tips" 
            className={`navbar-item ${location.pathname === '/donation-tips' ? 'active' : ''}`}
          >
            Donation Tips
          </Link>
          
          {loggedIn && (
            <>
              <Link 
                to="/donar" 
                className={`navbar-item ${location.pathname === '/donar' ? 'active' : ''}`}
              >
                Donate
              </Link>
              <Link 
                to="/request" 
                className={`navbar-item ${location.pathname === '/request' ? 'active' : ''}`}
              >
                Request
              </Link>
              {user?.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className={`navbar-item ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          
          <div className="navbar-end">
            {loggedIn ? (
              <div className="navbar-user-menu">
                <div className="navbar-user-button">
                  <span>{user?.name || 'User'}</span>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="navbar-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  NEW ACCOUNT
                </Link>
                <Link to="/admin-login" className="btn btn-admin">
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;