import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function MyBook() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    API.get(`/books/user/${user.id}`)
      .then((response) => {
        if (!isMounted) return;
        setBooks(response.data.books || []);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load your books.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (id, title) => {
    const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirm) return;

    try {
      await API.delete(`/books/${id}`);
      alert("Book deleted successfully.");
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete book.");
    }
  };

  return (
    <div className="my-books-page">
      <div className="page-header-row">
        <div>
          <h1>My Listed Books 📚</h1>
          <p className="subtitle">
            Manage your books available for peer exchange ({books.length} {books.length === 1 ? "book" : "books"})
          </p>
        </div>
        <Link to="/add-book" className="primary-cta-btn">
          + Share Another Book
        </Link>
      </div>

      {loading ? (
        <div className="page-loading-container">
          <div className="spinner"></div>
          <p>Fetching your books...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <Link to="/my-books" className="secondary-btn">
            Refresh
          </Link>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">📖</span>
          <h3>You haven't listed any books yet</h3>
          <p>Share textbooks, novels, or study notes you no longer need with fellow students.</p>
          <Link to="/add-book" className="primary-cta-btn">
            Share Your First Book Now
          </Link>
        </div>
      ) : (
        <div className="my-books-grid">
          {books.map((book) => (
            <div className="my-book-row-card" key={book.id}>
              <div className="my-book-cover-thumb">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="thumb-placeholder"
                  style={{ display: book.image ? "none" : "flex" }}
                >
                  📚
                </div>
              </div>

              <div className="my-book-info">
                <div className="my-book-badges">
                  <span className="category-pill">{book.category}</span>
                  <span className={`condition-badge condition-${book.book_condition?.toLowerCase() || "good"}`}>
                    {book.book_condition || "Good"}
                  </span>
                </div>
                <h3>{book.title}</h3>
                <p className="author-text">by {book.author}</p>
                {book.description && (
                  <p className="desc-preview">{book.description.substring(0, 100)}...</p>
                )}
              </div>

              <div className="my-book-actions">
                <Link to={`/books/${book.id}`} className="view-btn">
                  View
                </Link>
                <Link to={`/edit-book/${book.id}`} className="edit-action-btn">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  className="delete-action-btn"
                  title="Delete this book"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBook;
