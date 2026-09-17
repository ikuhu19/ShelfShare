import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "Computer Science",
    "Engineering",
    "Mathematics",
    "Business & Finance",
    "Science & Medicine",
    "Fiction & Literature",
    "Social Sciences",
    "Other"
  ];

  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "Computer Science",
    book_condition: "Good",
    description: "",
    image: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first to share books.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const response = await API.post("/books/add", {
        ...book,
        user_id: user.id
      });

      alert("Book Added Successfully 📚!");

      if (response.data.bookId) {
        navigate(`/books/${response.data.bookId}`);
      } else {
        navigate("/my-books");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to add book. Please verify your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-box">
        <div className="form-header-badge">
          <span>📚 Community Exchange</span>
        </div>
        <h1>Share Your Book</h1>
        <p>Give your unused textbooks and notes a new home on campus.</p>

        <form onSubmit={handleSubmit} className="add-book-form">
          <div className="input-group">
            <label htmlFor="title">Book Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Introduction to Database Systems"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-two-cols">
            <div className="input-group">
              <label htmlFor="author">Author *</label>
              <input
                id="author"
                type="text"
                name="author"
                placeholder="e.g. Abraham Silberschatz"
                value={book.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={book.category}
                onChange={handleChange}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="book_condition">Condition *</label>
            <select
              id="book_condition"
              name="book_condition"
              value={book.book_condition}
              onChange={handleChange}
              required
            >
              <option value="New">New (Mint, no writing/highlights)</option>
              <option value="Good">Good (Minor wear, clean pages)</option>
              <option value="Fair">Fair (Noticeable wear or annotations)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description & Course Notes (Optional)</label>
            <textarea
              id="description"
              name="description"
              placeholder="E.g., 8th Edition, used for CS201 at our college. Includes handwritten summary cheat sheets inside!"
              value={book.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="input-group">
            <label htmlFor="image">Cover Image URL (Optional)</label>
            <input
              id="image"
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/... or direct image link"
              value={book.image}
              onChange={handleChange}
            />
          </div>

          {book.image && (
            <div className="image-preview-card">
              <span className="preview-tag">Image Preview:</span>
              <img
                src={book.image}
                alt="Book cover preview"
                className="live-preview-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="form-btn-wrapper">
            <button type="submit" disabled={submitting} className="submit-book-btn">
              {submitting ? "Publishing Listing..." : "List Book for Exchange 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;