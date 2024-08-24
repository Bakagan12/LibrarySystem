const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import the MySQL connection pool

// Register
router.post('/register', async (req, res) => {
    const { first_name, last_name, middle_name, email, password } = req.body;

    try {
        const connection = await db.getConnection(); // Get a connection from the pool

        // Check if the user already exists
        const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length > 0) {
            connection.release(); // Release the connection back to the pool
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const [result] = await connection.query(
            'INSERT INTO user (first_name, last_name, middle_name, email, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, middle_name, email, hashedPassword]
        );

        connection.release(); // Release the connection back to the pool

        // Create a payload and generate a token
        const payload = {
            user: {
                id: result.insertId, // Use the ID from the result
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Error generating token:', err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }

                // Redirect to the login page
                res.redirect('/login');
            }
        );
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await db.getConnection(); // Get a connection from the pool

        // Check if the user exists
        const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length === 0) {
            connection.release(); // Release the connection back to the pool
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = rows[0];

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            connection.release(); // Release the connection back to the pool
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a payload and generate a token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('Error generating token:', err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
