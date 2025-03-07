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
        prescriptionUrl: {
          type: String,
          default: null,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
    isCheck: {
      type: String,
      enum: ['Accepted', 'In-Review', 'Deny'],
      default: 'In-Review',
    },
    deliveryOption: {
      type: String,
      enum: ['Home-Delivery', 'Store-Pickup', 'Express-Delivery'],
      required: true,
    },
    deliveryArea: {
      type: String,
    },
    deliveryDetailsAddress: {
      type: String,
    },

    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    transaction: {
      id: String,
      transaction_status: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

// Export Model
export const Order = model<TOrder>('Order', orderSchema);
