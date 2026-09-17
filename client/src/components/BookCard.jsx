import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function BookCard({ book, onRequestSent }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  const isOwner = user && user.id === book.user_id;

  const handleRequest = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login first to request books.");
      navigate("/login");
      return;
    }

    if (isOwner) {
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
      setRequestStatus("sent");
      if (onRequestSent) onRequestSent(book.id);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to send request. Please try again."
      );
    } finally {
      setRequesting(false);
    }
  };

  const conditionClass = {
    New: "condition-new",
    Good: "condition-good",
    Fair: "condition-fair"
  }[book.book_condition] || "condition-good";

  return (
    <div className="book-card">
      <div className="book-card-cover">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="book-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="book-placeholder-cover"
          style={{ display: book.image ? "none" : "flex" }}
        >
          <span className="cover-icon">📖</span>
          <span className="cover-category">{book.category}</span>
        </div>
        <span className={`condition-badge ${conditionClass}`}>
          {book.book_condition || "Good"}
        </span>
      </div>

      <div className="book-card-body">
        <span className="book-category-tag">{book.category}</span>
        <h3 className="book-title" title={book.title}>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">by {book.author}</p>

        <div className="book-meta">
          <div className="book-owner-info">
            <span className="owner-avatar">👤</span>
            <div>
              <span className="owner-label">Shared by</span>
              <strong className="owner-name">{book.owner || "Anonymous"}</strong>
              {book.owner_college && (
                <span className="owner-college"> • {book.owner_college}</span>
              )}
            </div>
          </div>
        </div>

        <div className="book-card-actions">
          <Link to={`/books/${book.id}`} className="view-btn">
            Details
          </Link>

          {isOwner ? (
            <Link to={`/edit-book/${book.id}`} className="owner-action-btn">
              Edit
            </Link>
          ) : (
            <button
              onClick={handleRequest}
              disabled={requesting || requestStatus === "sent"}
              className={`request-btn ${requestStatus === "sent" ? "sent" : ""}`}
            >
              {requesting ? "Sending..." : requestStatus === "sent" ? "Requested ✓" : "Request 📚"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;