import { Router } from 'express';
import requestValidation from '../../middlewares/requestValidation';
import { MedicineValidationSchemas } from './medicine.validation';
import { MedicineControllers } from './medicine.controllers';
import auth from '../../middlewares/authChecking';
import { UserRole } from '../user/user.constant';

// User Router
const medicineRouter = Router();

// Create Medicine
medicineRouter.post(
  '/create',
  auth(UserRole.Admin),
  requestValidation(MedicineValidationSchemas.createMedicineValidationSchema),
  MedicineControllers.createMedicine,
);

// Get All Medicine
medicineRouter.get('/',  MedicineControllers.getAllMedicines);

// Export User Router
export const MedicineRoutes = medicineRouter;
