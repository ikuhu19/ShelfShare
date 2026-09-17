import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    book_condition: "Good",
    description: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/books/${id}`);
        const data = response.data.book;

        if (user && data.user_id !== user.id) {
          alert("You do not have permission to edit this book.");
          navigate("/books");
          return;
        }

        if (isMounted) {
          setBook({
            title: data.title || "",
            author: data.author || "",
            category: data.category || "",
            book_condition: data.book_condition || "Good",
            description: data.description || "",
            image: data.image || ""
          });
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load book details.");
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
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      await API.put(`/books/${id}`, book);
      alert("Book Updated Successfully 📚");
      navigate(`/books/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update book.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading-container">
        <div className="spinner"></div>
        <p>Loading book data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/my-books" className="primary-link-btn">
          Back to My Books
        </Link>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <Link to={`/books/${id}`} className="back-link">← Cancel & Back</Link>
          <h1>Edit Book Details ✏️</h1>
          <p>Update the information about your listed book.</p>
        </div>

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <label htmlFor="title">Book Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Introduction to Algorithms"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="author">Author *</label>
              <input
                id="author"
                type="text"
                name="author"
                placeholder="e.g. Thomas H. Cormen"
                value={book.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={book.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="book_condition">Book Condition *</label>
            <select
              id="book_condition"
              name="book_condition"
              value={book.book_condition}
              onChange={handleChange}
              required
            >
              <option value="New">New (Unused, perfect condition)</option>
              <option value="Good">Good (Minor wear, no missing pages)</option>
              <option value="Fair">Fair (Noticeable wear, highlighted/annotated)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description & Notes</label>
            <textarea
              id="description"
              name="description"
              placeholder="Mention edition, highlighting, course name, or why you're sharing..."
              value={book.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Book Cover Image URL</label>
            <input
              id="image"
              type="url"
              name="image"
              placeholder="https://example.com/book-cover.jpg"
              value={book.image}
              onChange={handleChange}
            />
          </div>

          {book.image && (
            <div className="image-preview-box">
              <span className="preview-label">Live Cover Preview:</span>
              <img
                src={book.image}
                alt="Book cover preview"
                className="preview-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? "Saving Changes..." : "Save Changes 💾"}
            </button>
            <Link to={`/books/${id}`} className="secondary-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBook;
