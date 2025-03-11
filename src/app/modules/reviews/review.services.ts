/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Medicine } from '../medicine/medicine.model';
import { User } from '../user/user.model';
import { TMedicineReview } from './reviews.types';
import { Order } from '../order/order.model';
import { Review } from './reviews.mode';

// Review Save to DB
const reviewSaveToDB = async (payload: TMedicineReview) => {
  // Find User
  const user = await User.findById(payload?.userId);
  if (!user) {
    throw new AppError(404, 'User Not Found');
  }

  // Check Medicine Review Already Given or Not
  const isReview = await Review.find({ userId: payload?.userId, medicineId:payload?.medicineId });
  if (isReview?.length > 0) {
    throw new AppError(
      400,
      'You have already submitted a review for this Medicine!',
    );
  }

  // Find Medicine
  const medicine = await Medicine.findById(payload?.medicineId);
  if (!medicine) {
    throw new AppError(404, 'Medicine Not Found');
  }

  // Find Medicine in Order
  const order = await Order.findOne({
    user: payload?.userId,
    'medicines.medicine': payload?.medicineId,
  });
  if (!order) {
    throw new AppError(400, 'You must place an order before leaving a review.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create Review
    const reviews = await Review.create([payload], { session });
    if (!reviews?.length) {
      throw new AppError(400, 'Failed to Submit Your Review');
    }

    // Update Order
    const updateOrder = await Order.findOneAndUpdate(
      {
        user: payload?.userId,
        'medicines.medicine': payload?.medicineId,
      },
      { ratings: payload?.ratings },
      { new: true, session },
    );
    if (!updateOrder) {
      throw new AppError(400, 'Failed to Submit Your Review');
    }

    // Commot or Save Data
    await session.commitTransaction();
    // End Session
    await session.endSession();
    return reviews;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};



// Get Sngle Product Reviews From DB
const getSingleMedicineReviewsFromDB = async(id:string)=>{
    const reviews = await Review.find({ medicineId:id });
    return reviews
}

// Get All Reviews From DB
const getAllReviewsFromDB = async()=>{
    const reviews = await Review.find()
    return reviews
}
export const MedicineReviews = {
  reviewSaveToDB,
  getAllReviewsFromDB,
  getSingleMedicineReviewsFromDB,
};