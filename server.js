const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // serve CSS, images, JS

// --- USER PAGE ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ADMIN LOGIN PAGE ---
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// --- ADMIN LOGIN POST ---
app.post('/admin-login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.send('Wrong password!');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
