// order-service/src/events/eventListener.js

const queue = require('../config/queue');
const orderService = require('../services/orderService');

exports.start = async () => {
  const channel = queue.getChannel();
  if (!channel) {
    throw new Error('Message queue channel not established');
  }

  const exchange = 'microservices_exchange';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);

  const bindingKeys = ['user.registered', 'product.created'];

  for (const key of bindingKeys) {
    await channel.bindQueue(q.queue, exchange, key);
  }

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        const eventType = msg.fields.routingKey;
        const eventData = JSON.parse(msg.content.toString());
        handleEvent(eventType, eventData);
      }
    },
    { noAck: true }
  );
};

function handleEvent(eventType, eventData) {
  switch (eventType) {
    case 'user.registered':
      console.log('Received User Registered event', eventData);
      // Implement necessary logic (e.g., welcome email)
      break;
    case 'product.created':
      console.log('Received Product Created event', eventData);
      // Implement necessary logic (e.g., update product catalog)
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
}
