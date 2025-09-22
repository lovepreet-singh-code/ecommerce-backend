import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { initConsumer } from './kafka/consumer';
import { initProducer } from './kafka/producer';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await initProducer();
  await initConsumer();
  app.listen(PORT, () => {
    console.log(`Order service listening on ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
