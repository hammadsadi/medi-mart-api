import { Router } from 'express';
import { OrderControllers } from './order.controllers';
import auth from '../../middlewares/authChecking';
import { UserRole } from '../user/user.constant';
import { OrderValidationSchemas } from './order.validation';
import requestValidation from '../../middlewares/requestValidation';

// User Router
const orderRouter = Router();

// Create User
orderRouter.post(
  '/create',
  auth(UserRole.Customer, UserRole.Admin),
  requestValidation(OrderValidationSchemas.createOrderValidationSchema),
  OrderControllers.createOrder,
);

// Verify Payment
orderRouter.get(
  '/verify',
  auth(UserRole.Customer, UserRole.Admin),
  OrderControllers.verifyOrder,
);

// get Loged in User Order
orderRouter.get(
  '/my-orders',
  auth(UserRole.Customer, UserRole.Admin),
  OrderControllers.myOrder,
);

// get All Orders For Admin
orderRouter.get(
  '/all-orders',
  auth(UserRole.Customer, UserRole.Admin),
  OrderControllers.allOrderForAdmin,
);

// Update Order For Admin
orderRouter.patch(
  '/update-order/:orderId',
  auth(UserRole.Admin),
  OrderControllers.updateOrderForAdmin,
);

// Update Order For Admin
orderRouter.delete(
  '/delete-order/:orderId',
  auth(UserRole.Admin),
  OrderControllers.deleteOrderForAdmin,
);





// Export User Router
export const OrderRoutes = orderRouter;
