import { Router } from 'express';
import auth from '../../middlewares/authChecking';
import { UserRole } from '../user/user.constant';
import requestValidation from '../../middlewares/requestValidation';
import { ReviewValidationSchemas } from './review.validation';
import { MedicineReviewControllers } from './review.controllers';

// User Router
const reviewRouter = Router();

// Create Review
reviewRouter.post(
  '/create',
  auth(UserRole.Customer, UserRole.Admin),
  requestValidation(ReviewValidationSchemas.createReviewValidationSchema),
  MedicineReviewControllers.createReview
  
);


// Get All Medicines Reviews
reviewRouter.get(
  '/',
  MedicineReviewControllers.getAllMedicineReviews
  
);



// Get Single Medicine Reviews
reviewRouter.get(
  '/:medicineId',
  MedicineReviewControllers.singleMedicineReviews,
);



// Export User Router
export const ReviewRoutes = reviewRouter;
