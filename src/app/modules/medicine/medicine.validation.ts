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

// Update Medicine Validation Schema
const updateMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Medicine name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    stock: z
      .number()
      .int()
      .nonnegative('Stock must be a non-negative integer')
      .optional(),
    prescriptionRequired: z.boolean().optional(),
    manufacturer: z.string().min(1, 'Manufacturer is required').optional(),
    expiryDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid expiry date format',
      })
      .optional(),
    category: z.string().min(1, 'Category is required').optional(),
    symptoms: z
      .array(z.string())
      .min(1, 'At least one symptom is required')
      .optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
  }),
});

export const MedicineValidationSchemas = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
