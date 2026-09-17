import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/books/${id}`);
        if (isMounted) {
          setBook(response.data.book);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.response?.data?.message || "Book could not be found.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRequest = async () => {
    if (!user) {
      alert("Please log in to request an exchange for this book.");
      navigate("/login");
      return;
    }

    if (user.id === book.user_id) {
      alert("You cannot request your own book.");
      return;
    }

    try {
      setRequesting(true);
      const response = await API.post("/requests/send", {
        book_id: book.id,
        requester_id: user.id
      });
      alert(response.data.message || "Exchange request sent successfully!");
      setRequestSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send exchange request.");
    } finally {
      setRequesting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to remove this book listing?");
    if (!confirm) return;

    try {
      setDeleting(true);
      await API.delete(`/books/${id}`);
      alert("Book removed successfully.");
      navigate("/my-books");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete book.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading-container">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="error-container">
        <h2>Book Not Found</h2>
        <p>{error || "The book you are looking for does not exist or has been removed."}</p>
        <Link to="/books" className="primary-link-btn">
          Back to Books
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === book.user_id;

  const conditionClass = {
    New: "condition-new",
    Good: "condition-good",
    Fair: "condition-fair"
  }[book.book_condition] || "condition-good";

  return (
    <div className="book-details-page">
      <div className="details-nav-breadcrumb">
        <Link to="/books">← Back to All Books</Link>
      </div>

      <div className="details-layout">
        <div className="details-cover-column">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="details-book-img"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="details-placeholder-cover"
            style={{ display: book.image ? "none" : "flex" }}
          >
            <span className="details-cover-icon">📖</span>
            <span className="details-cover-cat">{book.category}</span>
          </div>

          <div className="availability-card">
            <span className="status-indicator-dot"></span>
            <strong>Status:</strong>{" "}
            {book.availability !== 0 ? "Available for Exchange" : "Currently Exchanged"}
          </div>
        </div>

        <div className="details-info-column">
          <div className="details-header-tags">
            <span className="category-pill">{book.category}</span>
            <span className={`condition-badge ${conditionClass}`}>
              Condition: {book.book_condition || "Good"}
            </span>
          </div>

          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">By <span className="author-name">{book.author}</span></p>

          <div className="details-description-box">
            <h3>About this Book</h3>
            <p>
              {book.description && book.description.trim() !== ""
                ? book.description
                : "No description provided by the owner. This book is available for peer exchange on ShelfShare."}
            </p>
          </div>

          <div className="owner-card">
            <div className="owner-avatar-lg">👤</div>
            <div className="owner-card-content">
              <h4>Shared by {book.owner || "ShelfShare Member"}</h4>
              {book.owner_college && (
                <p className="owner-detail">
                  🏫 <strong>College:</strong> {book.owner_college}
                </p>
              )}
              {isOwner && (
                <p className="owner-detail owner-badge-hint">
                  ✓ You are the owner of this book listing
                </p>
              )}
            </div>
          </div>

          <div className="details-actions">
            {isOwner ? (
              <div className="owner-actions-row">
                <Link to={`/edit-book/${book.id}`} className="edit-action-btn">
                  ✏️ Edit Book
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="delete-action-btn"
                >
                  {deleting ? "Deleting..." : "🗑️ Delete Listing"}
                </button>
              </div>
            ) : user ? (
              <button
                onClick={handleRequest}
                disabled={requesting || requestSuccess}
                className={`main-request-btn ${requestSuccess ? "success" : ""}`}
              >
                {requesting
                  ? "Sending Request..."
                  : requestSuccess
                  ? "Request Sent! Check Requests Page ✓"
                  : "Request Book for Exchange 📚"}
              </button>
            ) : (
              <Link to="/login" className="login-to-request-btn">
                Log In to Request Exchange 🔑
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
