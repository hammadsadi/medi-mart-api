import { Router } from 'express';
import { OrderControllers } from './order.controllers';
import auth from '../../middlewares/authChecking';
import { UserRole } from '../user/user.constant';

// User Router
const orderRouter = Router();

// Create User
orderRouter.post(
  '/create',
  auth(UserRole.Customer),
//   requestValidation(UserValidationSchemas.createUserValidationSchema),
  OrderControllers.createOrder,
);





// Export User Router
export const OrderRoutes = orderRouter;
