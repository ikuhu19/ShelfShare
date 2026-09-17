function SearchBar({
  keyword,
  setKeyword,
  category,
  setCategory,
  condition,
  setCondition,
  onSearch,
  onClear
}) {
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

  const conditions = ["All", "New", "Good", "Fair"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("All");
    if (setCondition) setCondition("All");
    if (onClear) onClear();
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, or keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setKeyword("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-select-wrapper">
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {setCondition && (
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            aria-label="Filter by condition"
          >
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Conditions" : `${c} Condition`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="search-actions">
        <button type="submit" className="search-btn">
          Search
        </button>
        {(keyword || (category && category !== "All") || (condition && condition !== "All")) && (
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
