const Order = require('../models/orderModel');
const eventPublisher = require('../events/eventPublisher');

exports.createOrder = async (orderData) => {
  const { userId, items, shippingAddress } = orderData;

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const newOrder = new Order({
    userId,
    items,
    totalAmount,
    shippingAddress,
  });

  await newOrder.save();

  eventPublisher.publish('order.placed', {
    orderId: newOrder._id,
    userId: newOrder.userId,
    items: newOrder.items,
  });

  return newOrder;
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

exports.getOrdersByUser = async (userId) => {
  return await Order.find({ userId });
};

exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  order.status = status;
  await order.save();

  // Emit "Order Status Updated" event
  eventPublisher.publish('order.status.updated', {
    orderId: order._id,
    status: order.status,
  });

  return order;
};
