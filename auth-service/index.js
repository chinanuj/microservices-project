const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

const db = new sqlite3.Database('./db/auth.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
});

app.use(express.json());

// Register API
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('User registered');
  });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.send(row ? 'Login successful' : 'Invalid credentials');
  });
});

app.listen(port,'0.0.0.0', () => console.log(`Auth service running on port ${port}`));