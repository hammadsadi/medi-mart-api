import { model, Schema } from 'mongoose';
import { TMedicineReview } from './reviews.types';
// Create Review Schema
const reviewSchema = new Schema<TMedicineReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Medicine',
    },
    ratings: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Export Model
export const Review = model<TMedicineReview>('Review', reviewSchema);
