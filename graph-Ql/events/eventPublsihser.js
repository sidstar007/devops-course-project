// graphql-gateway/src/events/eventPublisher.js

const amqp = require('amqplib');

let channel = null;

async function connect() {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
}

async function publish(eventType, data) {
  if (!channel) {
    await connect();
  }

  const exchange = 'microservices_exchange';
  await channel.assertExchange(exchange, 'topic', { durable: false });
  channel.publish(exchange, eventType, Buffer.from(JSON.stringify(data)));
  console.log(`Event published: ${eventType}`);
}

module.exports = { publish };
