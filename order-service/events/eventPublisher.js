// order-service/src/events/eventPublisher.js

const queue = require('../config/queue');

exports.publish = async (eventType, data) => {
  const channel = queue.getChannel();
  if (!channel) {
    throw new Error('Message queue channel not established');
  }

  const exchange = 'microservices_exchange';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  channel.publish(
    exchange,
    eventType,
    Buffer.from(JSON.stringify(data))
  );

  console.log(`Event published: ${eventType}`);
};
