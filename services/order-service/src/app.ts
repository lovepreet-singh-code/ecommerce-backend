import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import orderRoutes from './routes/order.routes';
import errorHandler from './middlewares/error.middleware';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);

app.use(errorHandler);

export default app;
