import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';

// Create a new order
export async function createOrderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { items, shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrder({ userId, items, shippingAddress, paymentMethod });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (err: any) {
    next(err);
  }
}

// Get a single order by ID
export async function getOrderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);

    // authorize: owner or admin
    if (order.user.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({ success: true, order });
  } catch (err: any) {
    next(err);
  }
}

// Get all orders for the logged-in user
export async function getUserOrdersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await orderService.getUserOrders(userId);
    res.json({ success: true, orders });
  } catch (err: any) {
    next(err);
  }
}

// Cancel an order
export async function cancelOrderHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orderId = req.params.id;
    const order = await orderService.cancelOrder(orderId, userId);

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (err: any) {
    next(err);
  }
}
