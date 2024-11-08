// user-service/src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db');
const queue = require('./config/queue');
const eventListener = require('./events/eventListner');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Start database connection
db.connect();

// Start queue connection and event listener
queue.connect().then(() => {
  eventListener.start();
});

// Start server
app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
});
