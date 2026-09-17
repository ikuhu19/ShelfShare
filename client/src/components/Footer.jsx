import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-icon">📚</span>
            <h3>ShelfShare</h3>
          </div>
          <p className="footer-tagline">
            Empowering students to share textbooks, study materials, and knowledge.
            A sustainable and affordable peer-to-peer campus book exchange platform.
          </p>
          <div className="footer-badges">
            <span className="campus-badge">🎓 Student Community</span>
            <span className="eco-badge">🌱 100% Sustainable</span>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/books">Available Books</Link></li>
            <li><Link to="/add-book">Share a Book</Link></li>
            <li><Link to="/dashboard">My Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/books">Computer Science</Link></li>
            <li><Link to="/books">Engineering</Link></li>
            <li><Link to="/books">Mathematics</Link></li>
            <li><Link to="/books">Business & Economics</Link></li>
            <li><Link to="/books">Literature & Fiction</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>How It Works</h4>
          <ul>
            <li><span>1. List your unused books</span></li>
            <li><span>2. Request books you need</span></li>
            <li><span>3. Connect & exchange on campus</span></li>
            <li><span>4. Keep knowledge flowing</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} ShelfShare. Built for student learning and book sharing.</p>
      </div>
    </footer>
  );
}

export default Footer;
