import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("books");

  const [myBooks, setMyBooks] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    Promise.all([
      API.get(`/books/user/${user.id}`).catch(() => ({ data: { books: [] } })),
      API.get(`/requests/${user.id}`).catch(() => ({ data: { requests: [] } })),
      API.get(`/requests/sent/${user.id}`).catch(() => ({ data: { requests: [] } }))
    ])
      .then(([booksRes, receivedRes, sentRes]) => {
        if (!isMounted) return;
        setMyBooks(booksRes.data.books || []);
        setReceivedRequests(receivedRes.data.requests || []);
        setSentRequests(sentRes.data.requests || []);
      })
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, refreshIndex]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });
      alert(`Request marked as ${status}!`);
      setRefreshIndex((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await API.delete(`/books/${bookId}`);
      setMyBooks((prev) => prev.filter((b) => b.id !== bookId));
      alert("Book deleted.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete book.");
    }
  };

  const pendingReceived = receivedRequests.filter((r) => r.status === "Pending").length;
  const acceptedReceived = receivedRequests.filter((r) => r.status === "Accepted").length;

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-text">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p className="campus-meta">
            {user?.college ? `🏫 ${user.college}` : "Student Member"} • ✉️ {user?.email}
          </p>
        </div>
        <div className="dashboard-quick-actions">
          <Link to="/add-book" className="primary-cta-btn">
            + List a New Book
          </Link>
          <Link to="/books" className="secondary-btn">
            Browse All Books
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card" onClick={() => setActiveTab("books")}>
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <span className="stat-value">{myBooks.length}</span>
            <span className="stat-label">Books Listed</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab("received")}>
          <span className="stat-icon">📩</span>
          <div className="stat-info">
            <span className="stat-value">{receivedRequests.length}</span>
            <span className="stat-label">Requests Received</span>
          </div>
          {pendingReceived > 0 && (
            <span className="pending-badge">{pendingReceived} Pending</span>
          )}
        </div>

        <div className="stat-card" onClick={() => setActiveTab("sent")}>
          <span className="stat-icon">📤</span>
          <div className="stat-info">
            <span className="stat-value">{sentRequests.length}</span>
            <span className="stat-label">Requests Sent</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🤝</span>
          <div className="stat-info">
            <span className="stat-value">{acceptedReceived}</span>
            <span className="stat-label">Exchanges Agreed</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dash-tab-btn ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          📚 My Books ({myBooks.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          📩 Received Requests ({receivedRequests.length})
          {pendingReceived > 0 && <span className="tab-pill-badge">{pendingReceived}</span>}
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          📤 Sent Requests ({sentRequests.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="dash-tab-content">
        {loading ? (
          <div className="page-loading-container">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* TAB: MY BOOKS */}
            {activeTab === "books" && (
              <div className="tab-pane">
                <div className="tab-pane-header">
                  <h3>Books You Are Sharing</h3>
                  <Link to="/add-book" className="small-link-cta">
                    + Add Another Book
                  </Link>
                </div>

                {myBooks.length === 0 ? (
                  <div className="empty-state-box">
                    <p>You haven't listed any books yet.</p>
                    <Link to="/add-book" className="primary-cta-btn">
                      Share Your First Book
                    </Link>
                  </div>
                ) : (
                  <div className="dash-books-list">
                    {myBooks.map((b) => (
                      <div className="dash-book-item" key={b.id}>
                        <div className="dash-book-thumb">
                          {b.image ? (
                            <img src={b.image} alt={b.title} />
                          ) : (
                            <span>📖</span>
                          )}
                        </div>
                        <div className="dash-book-details">
                          <h4>{b.title}</h4>
                          <p>by {b.author} • <span className="cat-text">{b.category}</span></p>
                          <span className={`condition-badge condition-${b.book_condition?.toLowerCase() || "good"}`}>
                            {b.book_condition || "Good"}
                          </span>
                        </div>
                        <div className="dash-book-actions">
                          <Link to={`/books/${b.id}`} className="view-btn">View</Link>
                          <Link to={`/edit-book/${b.id}`} className="edit-action-btn">Edit</Link>
                          <button
                            onClick={() => handleDeleteBook(b.id, b.title)}
                            className="delete-action-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RECEIVED REQUESTS */}
            {activeTab === "received" && (
              <div className="tab-pane">
                <div className="tab-pane-header">
                  <h3>Requests from Other Students for Your Books</h3>
                </div>

                {receivedRequests.length === 0 ? (
                  <div className="empty-state-box">
                    <p>No one has requested any of your books yet.</p>
                  </div>
                ) : (
                  <div className="dash-requests-list">
                    {receivedRequests.map((req) => (
                      <div className="dash-request-card" key={req.id}>
                        <div className="request-meta-header">
                          <h4>Book: <em>{req.title}</em></h4>
                          <span className={`status-tag status-${req.status?.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </div>

                        <div className="requester-box">
                          <p><strong>Requested By:</strong> {req.requester}</p>
                          {req.requester_college && (
                            <p><strong>College:</strong> {req.requester_college}</p>
                          )}
                          {req.status === "Accepted" && (
                            <div className="contact-revealed-box">
                              <p>🎉 <strong>Coordinate Handover:</strong></p>
                              {req.requester_email && <p>📧 Email: <a href={`mailto:${req.requester_email}`}>{req.requester_email}</a></p>}
                              {req.requester_phone && <p>📞 Phone: <a href={`tel:${req.requester_phone}`}>{req.requester_phone}</a></p>}
                            </div>
                          )}
                        </div>

                        {req.status === "Pending" && (
                          <div className="request-action-buttons">
                            <button
                              className="accept-btn"
                              onClick={() => handleUpdateStatus(req.id, "Accepted")}
                            >
                              ✓ Accept Request
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleUpdateStatus(req.id, "Rejected")}
                            >
                              ✕ Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SENT REQUESTS */}
            {activeTab === "sent" && (
              <div className="tab-pane">
                <div className="tab-pane-header">
                  <h3>Books You Have Requested from Others</h3>
                </div>

                {sentRequests.length === 0 ? (
                  <div className="empty-state-box">
                    <p>You haven't requested any books yet.</p>
                    <Link to="/books" className="primary-cta-btn">
                      Explore Available Books
                    </Link>
                  </div>
                ) : (
                  <div className="dash-requests-list">
                    {sentRequests.map((req) => (
                      <div className="dash-request-card" key={req.id}>
                        <div className="request-meta-header">
                          <h4>Book: <em>{req.title}</em></h4>
                          <span className={`status-tag status-${req.status?.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </div>

                        <p><strong>Shared by:</strong> {req.owner_name} {req.owner_college && `(${req.owner_college})`}</p>

                        {req.status === "Accepted" && (
                          <div className="contact-revealed-box">
                            <p>🎉 <strong>Request Accepted! Contact Owner:</strong></p>
                            {req.owner_email && <p>📧 Email: <a href={`mailto:${req.owner_email}`}>{req.owner_email}</a></p>}
                            {req.owner_phone && <p>📞 Phone: <a href={`tel:${req.owner_phone}`}>{req.owner_phone}</a></p>}
                          </div>
                        )}

                        {req.status === "Pending" && (
                          <p className="pending-hint-text">
                            ⏳ Waiting for {req.owner_name} to review your exchange request.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="tab-pane">
                <div className="profile-details-card">
                  <h3>Your ShelfShare Profile</h3>
                  <div className="profile-row">
                    <span className="profile-label">Full Name:</span>
                    <span className="profile-value">{user?.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email Address:</span>
                    <span className="profile-value">{user?.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Phone Number:</span>
                    <span className="profile-value">{user?.phone || "Not provided"}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">College / University:</span>
                    <span className="profile-value">{user?.college || "Not specified"}</span>
                  </div>
                  <div className="profile-tip-box">
                    💡 <strong>Safety Tip:</strong> Always arrange exchanges in well-lit, public campus locations such as library foyers or campus student centers.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;