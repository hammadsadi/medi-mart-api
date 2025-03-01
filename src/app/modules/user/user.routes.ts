import { Router } from 'express';
import { UserControllers } from './user.controllers';
import requestValidation from '../../middlewares/requestValidation';
import { UserValidationSchemas } from './user.validation';
import auth from '../../middlewares/authChecking';
import { UserRole } from './user.constant';

// User Router
const userRouter = Router();

// Create User
userRouter.post(
  '/create',
  requestValidation(UserValidationSchemas.createUserValidationSchema),
  UserControllers.createUser,
);

// All User
userRouter.get('/', UserControllers.getAllUsers);

// Single User
userRouter.get('/:userId', UserControllers.getSingleUser);

// Single User Info Update
userRouter.patch(
  '/info/update',
  auth(UserRole.Customer, UserRole.Admin),
  UserControllers.updateSingleUserPersonalInformation,
);

// Single User Block By Admin
userRouter.patch(
  '/block/user/:userId',
  auth(UserRole.Admin),
  UserControllers.userBlockByAdmin,
);

// Export User Router
export const UserRoutes = userRouter;
