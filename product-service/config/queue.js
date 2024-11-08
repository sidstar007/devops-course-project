// product-service/config/queue.js

const amqp = require('amqplib');

let channel = null;

async function connect() {
  try {
    const connection = await amqp.connect(
      process.env.AMQP_URL || 'amqp://localhost'
    );
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
}

function getChannel() {
  return channel;
}

module.exports = {
  connect,
  getChannel,
};
