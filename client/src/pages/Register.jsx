import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post("/users/register", user);
      alert(response.data.message || "Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header-icon">🎓</div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join your student book exchange community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="reg-name">Full Name *</label>
            <input
              id="reg-name"
              name="name"
              placeholder="e.g. John Doe"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@university.edu"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <div className="label-with-action">
              <label htmlFor="reg-password">Password *</label>
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="reg-college">College / University</label>
            <input
              id="reg-college"
              name="college"
              placeholder="e.g. Stanford University / Tech Campus"
              value={user.college}
              onChange={handleChange}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="reg-phone">Phone Number (Optional for handover)</label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              placeholder="e.g. +1 234 567 8900"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Creating Account..." : "Create Account ✨"}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;