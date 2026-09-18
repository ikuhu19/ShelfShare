import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MobileBottomNav() {
  const { user } = useAuth();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <span className="bottom-nav-icon">🏠</span>
        <span className="bottom-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/books"
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <span className="bottom-nav-icon">📚</span>
        <span className="bottom-nav-label">Explore</span>
      </NavLink>

      <NavLink
        to={user ? "/add-book" : "/login"}
        className={({ isActive }) => `bottom-nav-item add-highlight ${isActive ? "active" : ""}`}
      >
        <div className="center-action-btn">
          <span className="action-plus">+</span>
        </div>
        <span className="bottom-nav-label">Share</span>
      </NavLink>

      <NavLink
        to={user ? "/requests" : "/login"}
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <span className="bottom-nav-icon">📩</span>
        <span className="bottom-nav-label">Requests</span>
      </NavLink>

      <NavLink
        to={user ? "/dashboard" : "/login"}
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <span className="bottom-nav-icon">👤</span>
        <span className="bottom-nav-label">{user ? "Dashboard" : "Login"}</span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;
