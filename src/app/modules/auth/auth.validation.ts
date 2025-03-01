import { z } from "zod";

export const userLoginSchema = z.object({
  body: z.object({
    identifier: z.string({
      required_error: 'Email or Mobile Number is Required!',
    }),
    password: z.string({
      required_error: 'Password is Required!',
    }),
  }),
});


export const AuthValidationSchemas={
    userLoginSchema
}