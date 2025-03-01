/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: 'Customer' | 'Admin';
  image: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'deactivate';
};

export interface UserModel extends Model<TUser> {
  isExistUserByEmailOrNumber(emailOrNumber: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}