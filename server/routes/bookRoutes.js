const express = require("express");

const router = express.Router();

const {
    addBook,
    getBooks,
    searchBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.post("/add", addBook);

router.get("/all", getBooks);

router.get("/search", searchBooks);

router.get("/:id", getBookById);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

module.exports = router;