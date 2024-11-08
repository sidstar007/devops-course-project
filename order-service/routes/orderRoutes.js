// order-service/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.use(authMiddleware());

// Place a new order
router.post('/', orderController.createOrder);

// Get all orders for the authenticated user
router.get('/', orderController.getOrdersByUser);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
