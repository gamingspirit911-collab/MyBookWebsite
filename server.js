// FILE: server.js
// This runs on your computer using Node.js and stores your books

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'books.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme'; // Change this password

// Read books from books.json
function readBooks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

// Write books to books.json
function writeBooks(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
}

// Get all books
app.get('/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

// Add a new book (admin only)
app.post('/books', (req, res) => {
  const auth = (req.get('authorization') || '').split(' ')[1] || '';
  if (!auth || auth !== ADMIN_PASS)
    return res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });

  const { title, author, cover, pages, link } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });

  const books = readBooks();
  const book = {
    id: Date.now(),
    title,
    author: author || '',
    cover: cover || '',
    pages: Array.isArray(pages) ? pages : [],
    link: link || ''
  };
  books.unshift(book);
  writeBooks(books);
  res.json({ ok: true, book });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
