export type TCoupon = {
  code: string;
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  minOrderAmount: number;
  isActive: boolean;
  isDeleted: boolean;
};