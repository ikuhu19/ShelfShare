const db = require("../config/db");

// Send Exchange Request
const sendRequest = (req, res) => {

    const { book_id, requester_id } = req.body;

    const sql = `
        INSERT INTO exchange_requests
        (book_id, requester_id)
        VALUES (?, ?)
    `;

    db.query(sql, [book_id, requester_id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Exchange Request Sent Successfully"
        });

    });

};

// View Requests
const getRequests = (req, res) => {

    const { owner_id } = req.params;

    const sql = `
        SELECT
            exchange_requests.id,
            exchange_requests.status,
            books.title,
            users.name AS requester

        FROM exchange_requests

        JOIN books
        ON exchange_requests.book_id = books.id

        JOIN users
        ON exchange_requests.requester_id = users.id

        WHERE books.user_id = ?
    `;

    db.query(sql, [owner_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            requests: result
        });

    });

};

// Accept or Reject Request
const updateRequestStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE exchange_requests
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Request Updated Successfully"
        });

    });

};

module.exports = {
    sendRequest,
    getRequests,
    updateRequestStatus
};