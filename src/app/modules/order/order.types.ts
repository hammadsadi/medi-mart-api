import { Types } from "mongoose"

export type TOrderMedicine = {
    medicine: Types.ObjectId
    quantity:number
}

export type TOrder = {
  user: Types.ObjectId;
  medicines: TOrderMedicine[];
  totalPrice: number;
  coupon: Types.ObjectId | null;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryOption:
    | 'Home-Delivery'
    | 'Store-Pickup'
    | 'Express-Delivery'
    | 'Standard-Delivery';
  deliveryArea: string;
  deliveryDetailsAddress: string;
  prescriptionUrl: string;
  discount: number;
  deliveryCharge: number;
  finalAmount: number;
};