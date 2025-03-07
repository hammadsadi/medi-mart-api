import { Types } from "mongoose"

export type TOrderMedicine = {
  medicine: Types.ObjectId;
  quantity: number;
  prescriptionUrl: string;
};

export type TOrder = {
  user: Types.ObjectId;
  medicines: TOrderMedicine[];
  totalPrice: number;
  coupon?: string;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  isCheck: 'Accepted' | 'In-Review' | 'Deny';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryOption:
    | 'Home-Delivery'
    | 'Store-Pickup'
    | 'Express-Delivery'
    | 'Standard-Delivery';
  deliveryArea: string;
  deliveryDetailsAddress: string;
  discount: number;
  deliveryCharge: number;
  transaction: {
    id: string;
    transaction_status: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};