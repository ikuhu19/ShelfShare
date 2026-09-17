const db = require("../config/db");

// Send Exchange Request
const sendRequest = (req, res) => {
    const { book_id, requester_id } = req.body;

    if (!book_id || !requester_id) {
        return res.status(400).json({
            success: false,
            message: "Book ID and Requester ID are required"
        });
    }

    // Check if request already exists
    const checkSql = `
        SELECT id, status FROM exchange_requests 
        WHERE book_id = ? AND requester_id = ?
    `;

    db.query(checkSql, [book_id, requester_id], (checkErr, checkRows) => {
        if (checkErr) {
            return res.status(500).json({
                success: false,
                message: checkErr.message
            });
        }

        if (checkRows.length > 0) {
            return res.status(400).json({
                success: false,
                message: `You already have a ${checkRows[0].status.toLowerCase()} request for this book.`
            });
        }

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
    });
};

// View Requests Received by Book Owner
const getRequests = (req, res) => {
    const { owner_id } = req.params;

    const sql = `
        SELECT
            exchange_requests.id,
            exchange_requests.status,
            exchange_requests.request_date,
            exchange_requests.book_id,
            books.title,
            books.image,
            books.category,
            users.id AS requester_id,
            users.name AS requester,
            users.email AS requester_email,
            users.phone AS requester_phone,
            users.college AS requester_college
        FROM exchange_requests
        JOIN books ON exchange_requests.book_id = books.id
        JOIN users ON exchange_requests.requester_id = users.id
        WHERE books.user_id = ?
        ORDER BY exchange_requests.request_date DESC
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

// View Requests Sent by Requester
const getSentRequests = (req, res) => {
    const { requester_id } = req.params;

    const sql = `
        SELECT
            exchange_requests.id,
            exchange_requests.status,
            exchange_requests.request_date,
            exchange_requests.book_id,
            books.title,
            books.author,
            books.image,
            books.category,
            users.name AS owner_name,
            users.email AS owner_email,
            users.phone AS owner_phone,
            users.college AS owner_college
        FROM exchange_requests
        JOIN books ON exchange_requests.book_id = books.id
        JOIN users ON books.user_id = users.id
        WHERE exchange_requests.requester_id = ?
        ORDER BY exchange_requests.request_date DESC
    `;

    db.query(sql, [requester_id], (err, result) => {
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

// Cancel/Delete Request
const cancelRequest = (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM exchange_requests WHERE id = ?`;

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Request Cancelled Successfully"
        });
    });
};

module.exports = {
    sendRequest,
    getRequests,
    getSentRequests,
    updateRequestStatus,
    cancelRequest
};