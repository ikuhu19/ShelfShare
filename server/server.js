require("dotenv").config();

const express = require("express");
const cors = require("cors");


const db = require("./config/db");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
    res.send("🚀 ShelfShare Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});