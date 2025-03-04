import { z } from "zod";

const createCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(255).toUpperCase().trim(),
    discountValue: z.number().min(0),
    minOrderAmount: z.number().default(0),
    maxDiscountAmount: z.number().min(0).default(500000),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }),
});


export const CouponValidationSchemas = {
    createCouponValidationSchema
}