import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/useAuth";

function Requests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("received");
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
      API.get(`/requests/${user.id}`).catch(() => ({ data: { requests: [] } })),
      API.get(`/requests/sent/${user.id}`).catch(() => ({ data: { requests: [] } }))
    ])
      .then(([recRes, sentRes]) => {
        if (!isMounted) return;
        setReceivedRequests(recRes.data.requests || []);
        setSentRequests(sentRes.data.requests || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, refreshIndex]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });
      alert(`Request ${status} successfully!`);
      setRefreshIndex((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update request");
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await API.delete(`/requests/${id}`);
      alert("Request cancelled.");
      setSentRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to cancel request");
    }
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === "Pending").length;

  return (
    <div className="requests-page">
      <div className="requests-header-container">
        <h1>Book Exchange Requests 📩</h1>
        <p className="subtitle">
          Manage incoming requests for your books and track books you have requested.
        </p>

        <div className="requests-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            📥 Received Requests ({receivedRequests.length})
            {pendingReceivedCount > 0 && (
              <span className="pending-bubble">{pendingReceivedCount} pending</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            📤 Sent Requests ({sentRequests.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="page-loading-container">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      ) : activeTab === "received" ? (
        <div className="requests-tab-content">
          {receivedRequests.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-icon">📭</span>
              <h3>No Received Requests</h3>
              <p>When someone requests one of your listed books, their request will appear here.</p>
              <Link to="/add-book" className="primary-cta-btn">
                List More Books
              </Link>
            </div>
          ) : (
            <div className="requests-cards-grid">
              {receivedRequests.map((request) => (
                <div className="request-card-item" key={request.id}>
                  <div className="request-header-line">
                    <h3>{request.title}</h3>
                    <span className={`status-pill status-${request.status?.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="request-body-details">
                    <p><strong>Requester:</strong> {request.requester}</p>
                    {request.requester_college && (
                      <p><strong>College:</strong> {request.requester_college}</p>
                    )}
                    {request.request_date && (
                      <p className="date-text">
                        Requested on: {new Date(request.request_date).toLocaleDateString()}
                      </p>
                    )}

                    {request.status === "Accepted" && (
                      <div className="contact-revealed-box">
                        <p className="contact-heading">🎉 Request Accepted! Contact Requester:</p>
                        {request.requester_email && (
                          <p>✉️ <a href={`mailto:${request.requester_email}`}>{request.requester_email}</a></p>
                        )}
                        {request.requester_phone && (
                          <p>📞 <a href={`tel:${request.requester_phone}`}>{request.requester_phone}</a></p>
                        )}
                      </div>
                    )}
                  </div>

                  {request.status === "Pending" && (
                    <div className="request-buttons-row">
                      <button
                        className="accept-btn"
                        onClick={() => updateStatus(request.id, "Accepted")}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => updateStatus(request.id, "Rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="requests-tab-content">
          {sentRequests.length === 0 ? (
            <div className="empty-state-box">
              <span className="empty-icon">🔍</span>
              <h3>No Sent Requests</h3>
              <p>You haven't requested any books from other students yet.</p>
              <Link to="/books" className="primary-cta-btn">
                Browse Books to Exchange
              </Link>
            </div>
          ) : (
            <div className="requests-cards-grid">
              {sentRequests.map((request) => (
                <div className="request-card-item" key={request.id}>
                  <div className="request-header-line">
                    <h3>{request.title}</h3>
                    <span className={`status-pill status-${request.status?.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="request-body-details">
                    <p><strong>Owner:</strong> {request.owner_name} {request.owner_college && `(${request.owner_college})`}</p>
                    {request.request_date && (
                      <p className="date-text">
                        Sent on: {new Date(request.request_date).toLocaleDateString()}
                      </p>
                    )}

                    {request.status === "Accepted" && (
                      <div className="contact-revealed-box">
                        <p className="contact-heading">🎉 Request Accepted! Connect with Owner:</p>
                        {request.owner_email && (
                          <p>✉️ <a href={`mailto:${request.owner_email}`}>{request.owner_email}</a></p>
                        )}
                        {request.owner_phone && (
                          <p>📞 <a href={`tel:${request.owner_phone}`}>{request.owner_phone}</a></p>
                        )}
                      </div>
                    )}

                    {request.status === "Pending" && (
                      <p className="pending-hint-text">
                        ⏳ Awaiting response from {request.owner_name}.
                      </p>
                    )}
                  </div>

                  {request.status === "Pending" && (
                    <div className="request-buttons-row">
                      <button
                        className="cancel-btn"
                        onClick={() => cancelRequest(request.id)}
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Requests;