const db = require("../config/db");

// Add Book
const addBook = (req, res) => {
    const {
        user_id,
        title,
        author,
        category,
        book_condition,
        description,
        image
    } = req.body;

    if (!user_id || !title || !author || !category) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields: title, author, and category."
        });
    }

    // Default book_condition to 'Good' if invalid or missing to comply with enum('New','Good','Fair')
    const validConditions = ["New", "Good", "Fair"];
    const condition = validConditions.includes(book_condition) ? book_condition : "Good";

    const sql = `
        INSERT INTO books
        (user_id, title, author, category, book_condition, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, title, author, category, condition, description || "", image || ""],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Book Added Successfully",
                bookId: result.insertId
            });
        }
    );
};

// Get All Books
const getBooks = (req, res) => {
    const sql = `
        SELECT books.*, users.name AS owner, users.college AS owner_college
        FROM books
        JOIN users ON books.user_id = users.id
        ORDER BY books.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            books: result
        });
    });
};

// Search & Filter Books
const searchBooks = (req, res) => {
    const { keyword, category } = req.query;

    let sql = `
        SELECT books.*, users.name AS owner, users.college AS owner_college
        FROM books
        JOIN users ON books.user_id = users.id
        WHERE 1=1
    `;
    const params = [];

    if (keyword && keyword.trim() !== "") {
        const search = `%${keyword.trim()}%`;
        sql += ` AND (books.title LIKE ? OR books.author LIKE ? OR books.category LIKE ?)`;
        params.push(search, search, search);
    }

    if (category && category.trim() !== "" && category !== "All") {
        sql += ` AND books.category = ?`;
        params.push(category.trim());
    }

    sql += ` ORDER BY books.created_at DESC`;

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            books: result
        });
    });
};

// Get Single Book
const getBookById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT books.*, users.name AS owner, users.email AS owner_email, users.phone AS owner_phone, users.college AS owner_college
        FROM books
        JOIN users ON books.user_id = users.id
        WHERE books.id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            book: result[0]
        });
    });
};

// Get Books Added by Specific User
const getUserBooks = (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT *
        FROM books
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            books: result
        });
    });
};

// Update Book
const updateBook = (req, res) => {
    const { id } = req.params;

    const {
        title,
        author,
        category,
        book_condition,
        description,
        image
    } = req.body;

    const validConditions = ["New", "Good", "Fair"];
    const condition = validConditions.includes(book_condition) ? book_condition : "Good";

    const sql = `
        UPDATE books
        SET
        title=?,
        author=?,
        category=?,
        book_condition=?,
        description=?,
        image=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            title,
            author,
            category,
            condition,
            description || "",
            image || "",
            id
        ],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Book Updated Successfully"
            });
        }
    );
};

// Delete Book
const deleteBook = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM books WHERE id=?",
        [id],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Book Deleted Successfully"
            });
        }
    );
};

module.exports = {
    addBook,
    getBooks,
    searchBooks,
    getBookById,
    getUserBooks,
    updateBook,
    deleteBook
};