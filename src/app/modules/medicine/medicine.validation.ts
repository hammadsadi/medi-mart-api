import { z } from 'zod';

// Create Medicine Validation Schema
const createMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Medicine name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be a positive number'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    prescriptionRequired: z.boolean(),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    expiryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid expiry date format',
    }),
    category: z.string().min(1, 'Category is required'),
    symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
    imageUrl: z.string().url('Invalid image URL'),
  }),
});

export const MedicineValidationSchemas = {
  createMedicineValidationSchema,
};
