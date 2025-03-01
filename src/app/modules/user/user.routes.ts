import { Router } from "express";
import { UserControllers } from "./user.controllers";
import requestValidation from "../../middlewares/requestValidation";
import { UserValidationSchemas } from "./user.validation";

// User Router
const userRouter = Router()

// Create User
userRouter.post('/create', requestValidation(UserValidationSchemas.createUserValidationSchema), UserControllers.createUser)


// Export User Router
export const UserRoutes = userRouter