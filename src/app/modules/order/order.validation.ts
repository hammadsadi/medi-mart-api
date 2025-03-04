import { z } from "zod";

const createOrderValidationSchema = z.object({
  body: z.object({
    medicines: z
      .array(
        z.object({
          medicine: z.string({ required_error: 'Medicine is required' }),
          quantity: z
            .number()
            .min(1, { message: 'Quantity must be at least 1' }),
        }),
      )
      .min(1, { message: ' Please Order At least one medicine!' }),
    deliveryOption: z.enum(
      ['Home-Delivery', 'Store-Pickup', 'Express-Delivery'],
      {
        required_error: 'Delivery option is required!',
      },
    ),
  }),
});

export const OrderValidationSchemas = {
    createOrderValidationSchema
}