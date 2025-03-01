import { model, Schema } from 'mongoose';
import { TMedicine } from './medicine.types';
// Create Medicine Schema
const medicineSchema = new Schema<TMedicine>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    prescriptionRequired: {
      type: Boolean,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Export Model
export const Medicine = model<TMedicine>('Medicine', medicineSchema);
