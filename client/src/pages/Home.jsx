import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import BookCard from "../components/BookCard";

function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await API.get("/books/all");
        setFeaturedBooks((response.data.books || []).slice(0, 3));
      } catch (err) {
        console.error("Error loading featured books:", err);
      } finally {
        setLoadingBooks(false);
      }
    };
    loadFeatured();
  }, []);

  const categories = [
    { name: "Computer Science", icon: "💻", count: "Textbooks & Guides" },
    { name: "Engineering", icon: "⚙️", count: "Core & Reference" },
    { name: "Mathematics", icon: "📐", count: "Calculus & Algebra" },
    { name: "Business & Finance", icon: "📈", count: "Economics & MBA" },
    { name: "Science & Medicine", icon: "🔬", count: "Biology, Chem & Physics" },
    { name: "Fiction & Literature", icon: "📖", count: "Classics & Novels" }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🎓 The Campus Book Exchange Network</span>
          </div>

          <h1>
            Share Books.<br />
            Share Knowledge. 📚
          </h1>

          <p>
            Stop spending hundreds on textbooks every semester. ShelfShare connects students
            to exchange books, lecture notes, and learning resources easily, sustainably, and for free.
          </p>

          <div className="hero-buttons">
            <Link to="/books" className="hero-primary-btn">
              Explore Available Books 🔍
            </Link>
            <Link to="/add-book" className="hero-secondary-btn">
              + Share a Book
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <strong>100%</strong>
              <span>Free Peer Exchange</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <strong>Zero</strong>
              <span>Textbook Waste</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <strong>Direct</strong>
              <span>Campus Connections</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header-row">
          <div>
            <h2>Recently Added Books</h2>
            <p>Fresh arrivals from students ready for exchange</p>
          </div>
          <Link to="/books" className="see-all-link">
            View All Books →
          </Link>
        </div>

        {loadingBooks ? (
          <div className="loading-spinner-box">
            <div className="spinner"></div>
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="book-grid">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="empty-featured-box">
            <p>Be the first to list a book for your campus community!</p>
            <Link to="/add-book" className="primary-cta-btn">
              Share a Book Now
            </Link>
          </div>
        )}
      </section>

      {/* Popular Categories Grid */}
      <section className="categories-section">
        <div className="section-header-center">
          <h2>Browse by Subject</h2>
          <p>Find course material tailored to your field of study</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/books`} key={cat.name} className="category-card">
              <span className="cat-icon">{cat.icon}</span>
              <h4>{cat.name}</h4>
              <p>{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header-center">
          <h2>How ShelfShare Works</h2>
          <p>Exchange textbooks in 3 simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">1</div>
            <span className="step-icon">📸</span>
            <h3>List Your Book</h3>
            <p>
              Snap a picture or add book details in less than a minute. Your listing becomes instantly visible to campus peers.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <span className="step-icon">🤝</span>
            <h3>Connect & Request</h3>
            <p>
              Browse requested books or discover titles you need. Send an exchange request with one click.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <span className="step-icon">🎒</span>
            <h3>Handover On Campus</h3>
            <p>
              Meet safely at the campus library, cafeteria, or union to swap books and share course insights.
            </p>
          </div>
        </div>
      </section>

      {/* Features / Why ShelfShare */}
      <section className="features">
        <h2>Why ShelfShare?</h2>

        <div className="cards">
          <div className="card">
            <div className="card-icon">📚</div>
            <h3>Save Money</h3>
            <p>
              Textbooks can cost upwards of $500 per semester. Reusing books among peers keeps higher education affordable.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🌱</div>
            <h3>Campus Sustainability</h3>
            <p>
              Extend the life cycle of every book and reduce the paper footprint generated by reprinting editions.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">👥</div>
            <h3>Peer Mentorship</h3>
            <p>
              Connect directly with seniors who've taken your classes, passed notes, and can give insider study tips.
            </p>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="community-cta-section">
        <div className="cta-inner-card">
          <h2>Ready to Share Knowledge?</h2>
          <p>Join hundreds of students turning their bookshelves into active learning libraries.</p>
          <div className="cta-actions">
            <Link to="/register" className="cta-primary-btn">
              Create Free Account 🚀
            </Link>
            <Link to="/books" className="cta-secondary-btn">
              Browse Available Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;