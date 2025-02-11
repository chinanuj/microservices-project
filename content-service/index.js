const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3002;

const db = new sqlite3.Database('./db/content.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY, title TEXT, body TEXT)");
});

app.use(express.json());

// Create content API
app.post('/content', (req, res) => {
  const { title, body } = req.body;
  db.run('INSERT INTO content (title, body) VALUES (?, ?)', [title, body], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Content created');
  });
});

// Get content API
app.get('/content/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM content WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json(row || {});
  });
});

app.listen(port, () => console.log(`Content service running on port ${port}`));