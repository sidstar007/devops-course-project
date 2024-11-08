// user-service/src/events/eventListener.js

const queue =require('.././config/queue');
exports.start = async () => {
  const channel = queue.getChannel();
  if (!channel) {
    throw new Error('Message queue channel not established');
  }

  const exchange = 'microservices_exchange';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);

  const bindingKeys = ['order.placed', 'order.shipped'];

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
    case 'order.placed':
      console.log('Received Order Placed event', eventData);
      // Implement necessary logic
      break;
    case 'order.shipped':
      console.log('Received Order Shipped event', eventData);
      // Implement necessary logic
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
}
