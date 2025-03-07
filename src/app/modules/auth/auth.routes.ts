import { Router } from 'express';
import requestValidation from '../../middlewares/requestValidation';
import { AuthValidationSchemas } from './auth.validation';
import { AuthControllers } from './auth.controllers';
import auth from '../../middlewares/authChecking';
import { UserRole } from '../user/user.constant';

// User Router
const authRouter = Router();

// Create User
authRouter.post(
  '/login',
  requestValidation(AuthValidationSchemas.userLoginSchema),
  AuthControllers.userLogin,
);

// LoggedIn User
authRouter.get(
  '/me',
  auth(UserRole.Admin, UserRole.Customer),
  AuthControllers.loggedInUser,
);

// Export User Router
export const AuthRoutes = authRouter;
