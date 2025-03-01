import { model, Schema } from 'mongoose';
import { TOrder } from './order.types';
// Create Medicine Schema
const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medicines: [
      {
        medicine: Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Coupon',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    deliveryOption: {
      type: String,
      enum: [
        'Home-Delivery',
        'Store-Pickup',
        'Express-Delivery',
        'Standard-Delivery',
      ],
      required: true,
    },
    deliveryArea: {
      type: String,
      required: true,
    },
    deliveryDetailsAddress: {
      type: String,
      required: true,
    },
    prescriptionUrl: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Export Model
export const Order = model<TOrder>('Order', orderSchema);
