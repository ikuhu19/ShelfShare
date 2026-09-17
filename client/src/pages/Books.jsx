import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import API from "../api/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");

  const categories = [
    "All",
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

    const loadBooks = async () => {
      try {
        setLoading(true);
        let response;

        const hasKeyword = keyword.trim() !== "";
        const hasCategory = category !== "All";

        if (hasKeyword || hasCategory) {
          const params = new URLSearchParams();
          if (hasKeyword) params.append("keyword", keyword.trim());
          if (hasCategory) params.append("category", category);

          response = await API.get(`/books/search?${params.toString()}`);
        } else {
          response = await API.get("/books/all");
        }

        if (isMounted) {
          setBooks(response.data.books || []);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [keyword, category]);

  // Client-side condition filter if selected
  const filteredBooks = books.filter((b) => {
    if (condition === "All") return true;
    return b.book_condition === condition;
  });

  return (
    <div className="books-page">
      <div className="books-page-header">
        <h1>Explore Available Books 📚</h1>
        <p className="subtitle">
          Find textbooks, notes, and reading materials shared by fellow students.
        </p>
      </div>

      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        category={category}
        setCategory={setCategory}
        condition={condition}
        setCondition={setCondition}
        onSearch={() => {}}
        onClear={() => {
          setKeyword("");
          setCategory("All");
          setCondition("All");
        }}
      />

      {/* Category Pills Bar */}
      <div className="category-pills-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-pill-btn ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="books-count-row">
        <span>Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}</span>
      </div>

      {loading ? (
        <div className="page-loading-container">
          <div className="spinner"></div>
          <p>Finding books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">🔍</span>
          <h3>No books match your criteria</h3>
          <p>Try clearing filters or search with a different keyword or category.</p>
          <button
            onClick={() => {
              setKeyword("");
              setCategory("All");
              setCondition("All");
            }}
            className="secondary-btn"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;