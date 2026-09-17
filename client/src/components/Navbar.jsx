import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    alert("Logged out successfully");
    navigate("/login");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">📚</span>
          <span className="brand-text">ShelfShare</span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Home
          </NavLink>

          <NavLink to="/books" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Explore Books
          </NavLink>

          {user ? (
            <>
              <NavLink to="/add-book" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                + Share Book
              </NavLink>

              <NavLink to="/my-books" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                My Books
              </NavLink>

              <NavLink to="/requests" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                Requests
              </NavLink>

              <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
                Dashboard
              </NavLink>

              <div className="user-profile-pill">
                <span className="user-avatar-badge">👤</span>
                <span className="user-greeting">{user.name}</span>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="nav-logout-btn"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" onClick={closeMenu} className="login-link">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="register-cta">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;