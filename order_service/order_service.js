const express = require('express');
const redis = require('redis');
const app = express();
app.use(express.json());

const client = redis.createClient();
client.connect();

app.post('/orders', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const order = { user_id, product_id, quantity, status: 'Pending' };
    await client.set(`order:${user_id}`, JSON.stringify(order));
    res.status(201).json(order);
});

app.get('/orders/:id', async (req, res) => {
    const order = await client.get(`order:${req.params.id}`);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(JSON.parse(order));
});

app.listen(3002, () => console.log('Order service running on port 3002'));