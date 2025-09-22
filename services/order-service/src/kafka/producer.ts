import { kafka } from '../config/kafka';

const producer = kafka.producer();

export async function initProducer() {
  await producer.connect();
  console.log('Kafka producer connected');
}

export async function produce(topic: string, message: any) {
  try {
    await producer.send({
      topic,
      messages: [{ value: typeof message === 'string' ? message : JSON.stringify(message) }],
    });
  } catch (err) {
    console.error('Kafka produce error:', err);
    // don't throw for now — we still want order creation to succeed even if Kafka temporarily fails
  }
}
