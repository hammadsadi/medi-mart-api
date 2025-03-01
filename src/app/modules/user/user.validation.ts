import { z } from "zod";

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'User Name is Required!' }),
    email: z.string().email('Invalid Email Format!'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
});


export const UserValidationSchemas ={
createUserValidationSchema
}