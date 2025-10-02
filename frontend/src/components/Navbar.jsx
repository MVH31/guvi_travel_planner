import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          Travel Itinerary
        </Link>

        {/* Navigation Links */}
        <div className="navbar-menu">
          {isAuthenticated() ? (
            // Logged in user
            <div className="navbar-user">
              <span className="user-greeting">
                Welcome, {user?.name || user?.email}!
              </span>
              <Link to="/profile" className="navbar-link profile-link">
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            // Not logged in
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link register-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;