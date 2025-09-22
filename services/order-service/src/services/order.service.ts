import Order, { IOrder } from '../models/order.model';
import axios from 'axios';
import { Types } from 'mongoose';
import { produce } from '../kafka/producer';

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  userId: string;
  items: OrderItemInput[];
  shippingAddress?: any;
  paymentMethod?: string;
};

// ✅ Create order
export async function createOrder(input: CreateOrderInput): Promise<IOrder> {
  const productBase = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5002';

  let total = 0;
  const itemsWithPrice: { productId: Types.ObjectId; quantity: number; price: number }[] = [];

  for (const it of input.items) {
    try {
      const res = await axios.get(`${productBase}/api/products/${it.productId}`);
      const product = res.data.data; // extract product from response

      if (!product) throw new Error(`Product ${it.productId} not found`);
      if (product.stock < it.quantity) throw new Error(`Insufficient stock for product ${it.productId}`);

      const price = Number(product.price);
      if (!price || isNaN(price)) throw new Error(`Invalid price for product ${it.productId}`);

      total += price * it.quantity;

      itemsWithPrice.push({
        productId: new Types.ObjectId(it.productId),
        quantity: it.quantity,
        price,
      });
    } catch (err: any) {
      throw {
        status: 400,
        message: err.response?.data?.message || err.message || 'Product validation failed',
      };
    }
  }

  const order = await Order.create({
    user: new Types.ObjectId(input.userId),
    items: itemsWithPrice,
    totalAmount: total,
    shippingAddress: input.shippingAddress,
    status: 'pending',
    paymentMethod: input.paymentMethod || 'cod',
  } as Partial<IOrder>);

  await produce(process.env.ORDER_TOPIC || 'order.created', {
    orderId: order._id.toString(),
    userId: input.userId,
    totalAmount: total,
  });

  return order;
}

// ✅ Get single order
export async function getOrderById(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId).lean();
  if (!order) throw { status: 404, message: 'Order not found' };
  return order as IOrder;
}

// ✅ Get all orders for a user
export async function getUserOrders(userId: string): Promise<IOrder[]> {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  return orders as IOrder[];
}

// ✅ Cancel order
export async function cancelOrder(orderId: string, userId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };
  if (order.user.toString() !== userId) throw { status: 403, message: 'Not allowed' };
  if (['shipped', 'delivered'].includes(order.status)) throw { status: 400, message: 'Cannot cancel after shipping' };

  order.status = 'cancelled';
  await order.save();

  await produce('order.updated', { orderId: order._id.toString(), status: 'cancelled' });

  return order;
}

