import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import {
  createOrderHandler,
  getOrderHandler,
  getUserOrdersHandler,
  cancelOrderHandler,
} from '../controllers/order.controller';

const router = Router();

router.post('/', auth, createOrderHandler);
router.get('/user', auth, getUserOrdersHandler);
router.get('/:id', auth, getOrderHandler);
router.delete('/:id', auth, cancelOrderHandler);

export default router;
