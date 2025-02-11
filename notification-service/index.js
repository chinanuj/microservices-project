const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3003;

const db = new sqlite3.Database('./db/notifications.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY, message TEXT, status TEXT)");
});

app.use(express.json());

// Send notification API
app.post('/notify', (req, res) => {
  const { message } = req.body;
  db.run('INSERT INTO notifications (message, status) VALUES (?, "sent")', [message], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Notification sent');
  });
});

// Check notifications API
app.get('/notifications', (req, res) => {
  db.all('SELECT * FROM notifications', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.listen(port,'0.0.0.0' ,() => console.log(`Notification service running on port ${port}`));