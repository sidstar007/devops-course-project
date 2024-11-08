// order-service/src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const db = require('./config/db');
const queue = require('./config/queue');
const eventListener = require('./events/eventListener');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/orders', orderRoutes);

// Start database connection
db.connect();

// Start queue connection and event listener
queue.connect().then(() => {
  eventListener.start();
});

// Start server
app.listen(port, () => {
  console.log(`Order Service listening on port ${port}`);
});
