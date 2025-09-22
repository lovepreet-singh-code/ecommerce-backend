import { Schema, model, Document, Types } from 'mongoose';

export type OrderItem = {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
};

export interface IOrder extends Document {
  user: Types.ObjectId | string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentInfo?: {
    method?: string;
    transactionId?: string;
    status?: string;
  };
  shippingAddress?: any;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentInfo: { type: Schema.Types.Mixed },
    shippingAddress: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default model<IOrder>('Order', orderSchema);
