import { useState, useEffect } from "react";

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`network-status-banner ${!isOnline ? "offline" : "reconnected"}`}
      role="alert"
      aria-live="polite"
    >
      {!isOnline ? (
        <div className="network-banner-content">
          <span className="network-banner-icon">⚡</span>
          <span className="network-banner-text">
            <strong>You are currently offline.</strong> Some book listings and exchanges may require an internet connection.
          </span>
          <button
            className="network-retry-btn"
            onClick={() => window.location.reload()}
            title="Retry connecting"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="network-banner-content">
          <span className="network-banner-icon">✅</span>
          <span className="network-banner-text">
            <strong>Connection restored!</strong> You are back online.
          </span>
        </div>
      )}
    </div>
  );
}

export default NetworkStatus;
