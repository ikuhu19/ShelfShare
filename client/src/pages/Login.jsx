import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: ""
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
      const response = await API.post("/users/login", user);

      login(response.data.user);
      alert("Login Successful 🎉 Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header-icon">📚</div>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to your ShelfShare account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@college.edu"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <div className="label-with-action">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Logging in..." : "Log In →"}
          </button>
        </form>

        <div className="auth-footer-text">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;