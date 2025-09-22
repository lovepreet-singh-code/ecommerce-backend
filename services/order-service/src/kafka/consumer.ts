import { kafka } from '../config/kafka';
import Order from '../models/order.model';

export async function initConsumer() {
  const consumer = kafka.consumer({ groupId: 'order-service-group' });
  await consumer.connect();
  const topic = process.env.PAYMENT_SERVICE_TOPIC || 'payment.completed';
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      // removed partition entirely
      const raw = message.value?.toString();
      console.log(`Kafka msg on ${topic}:`, raw);
      try {
        const payload = raw ? JSON.parse(raw) : null;
        if (payload?.orderId && payload?.status === 'paid') {
          await Order.findByIdAndUpdate(payload.orderId, {
            status: 'paid',
            'paymentInfo.transactionId': payload.transactionId,
            'paymentInfo.status': 'paid',
          });
        }
      } catch (err) {
        console.error('Error processing consumer message:', err);
      }
    },
  });
}
