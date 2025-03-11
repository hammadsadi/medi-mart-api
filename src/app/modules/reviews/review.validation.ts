import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User Id is Reqired!' }),
    medicineId: z.string({ required_error: 'Medicine Id is Reqired!' }),
    review: z.string({ required_error: 'Review is Reqired!' }),
    ratings: z.number({ required_error: 'Review Ratings is Reqired!' }),
  }),
});

export const ReviewValidationSchemas = {
   createReviewValidationSchema
}