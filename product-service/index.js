// product-service/src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const db = require('./config/db')
const queue = require('./config/queue');
const eventListener = require('./events/eventListener');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);

// Start database connection
db.connect();

// Start queue connection and event listener
queue.connect().then(() => {
  eventListener.start();
});

// Start server
app.listen(port, () => {
  console.log(`Product Service listening on port ${port}`);
});
