const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'productdb',
    password: 'password',
    port: 5432,
});

app.post('/products', async (req, res) => {
    const { name, price, stock } = req.body;
    const result = await pool.query('INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *', [name, price, stock]);
    res.status(201).json(result.rows[0]);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, price, stock FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
});

app.listen(3001, () => console.log('Product service running on port 3001'));