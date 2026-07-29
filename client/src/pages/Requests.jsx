import { useEffect, useState } from "react";
import API from "../api/api";

function Requests() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);

  useEffect(() => {

    fetchRequests();

  }, []);

  const fetchRequests = async () => {

    try {

      const response = await API.get(`/requests/${user.id}`);
      setRequests(response.data.requests);

    } catch (error) {

      console.log(error);

    }

  };

  const updateStatus = async (id, status) => {

    try {

      await API.put(`/requests/${id}`, {
        status
      });

      alert(`Request ${status}`);

      fetchRequests();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="requests-page">

      <h1>Book Requests 📩</h1>

      {
        requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (

          requests.map((request) => (

            <div
              className="request-card"
              key={request.id}
            >

              <h3>{request.title}</h3>

              <p>
                Requested By: {request.requester}
              </p>

              <p>
                Status: {request.status}
              </p>

              {
                request.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(request.id, "Accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(request.id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )
              }

            </div>

          ))

        )
      }

    </div>

  );

}

export default Requests;