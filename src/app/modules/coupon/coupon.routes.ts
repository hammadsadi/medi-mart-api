import { Router } from 'express';
import requestValidation from '../../middlewares/requestValidation';
import { CouponValidationSchemas } from './coupon.vlaidation';
import { CouponControllers } from './coupon.controllers';

// User Router
const couponRouter = Router();

// Create Coupon
couponRouter.post(
  '/create',
  requestValidation(CouponValidationSchemas.createCouponValidationSchema),
  CouponControllers.createCoupon,
);

// Get All Coupon
couponRouter.get(
  '/',
  CouponControllers.getAllCoupons,
);

// Delete Single Coupon
couponRouter.delete('/:couponId', CouponControllers.deleteSingleCoupon);

// Export User Router
export const CouponRoutes = couponRouter;
