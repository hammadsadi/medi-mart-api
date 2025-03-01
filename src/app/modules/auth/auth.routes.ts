import { Router } from 'express';
import requestValidation from '../../middlewares/requestValidation';
import { AuthValidationSchemas } from './auth.validation';
import { AuthControllers } from './auth.controllers';

// User Router
const authRouter = Router();

// Create User
authRouter.post(
  '/login',
  requestValidation(AuthValidationSchemas.userLoginSchema),
  AuthControllers.userLogin,
);

// Export User Router
export const AuthRoutes = authRouter;
