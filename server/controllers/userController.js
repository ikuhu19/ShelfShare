const db = require("../config/db");
const bcrypt = require("bcrypt");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, college } = req.body;

        // Check if email already exists
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists",
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO users
                    (name,email,password,phone,college)
                    VALUES (?,?,?,?,?)
                `;

                db.query(
                    sql,
                    [name, email, hashedPassword, phone, college],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message,
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "User Registered Successfully!",
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Login User
const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            if (result.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "User not found",
                });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Password",
                });
            }

            res.status(200).json({
                success: true,
                message: "Login Successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    college: user.college,
                },
            });
        }
    );
};

module.exports = {
    registerUser,
    loginUser,
};