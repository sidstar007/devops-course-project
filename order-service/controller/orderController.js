// order-service/src/controllers/orderController.js

const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = {
      userId,
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
    };
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
