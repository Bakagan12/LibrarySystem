const express = require('express');
const path = require('path');
const { query } = require('./config/db');

const app = express();

// Middleware to parse JSON
app.use(express.json({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define Routes
app.use('/', require('./routes/auth'));

// Serve HTML files from the "public/resources/views" directory
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resources/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resources/views/register.html'));
});

// Protect the dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resources/views/index.html'));
});

// Serve the database connection check page
app.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resources/views/check-db.html'));
});


// Set the port number
const PORT = process.env.PORT || 3606;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
