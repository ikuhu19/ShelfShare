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

    const sql = `
        INSERT INTO books
        (user_id, title, author, category, book_condition, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, title, author, category, book_condition, description, image],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Book Added Successfully"
            });
        }
    );
};

// Get All Books
const getBooks = (req, res) => {

    const sql = `
        SELECT books.*, users.name AS owner
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

// Search Books
const searchBooks = (req, res) => {

    const { keyword } = req.query;

    const search = `%${keyword}%`;

    const sql = `
        SELECT books.*, users.name AS owner
        FROM books
        JOIN users ON books.user_id = users.id
        WHERE
        books.title LIKE ?
        OR books.author LIKE ?
        OR books.category LIKE ?
    `;

    db.query(sql, [search, search, search], (err, result) => {

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
        SELECT books.*, users.name AS owner
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
            book_condition,
            description,
            image,
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
    updateBook,
    deleteBook
};