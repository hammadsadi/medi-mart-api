/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.types';
// Create User Schema
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin'],
      default: 'Customer',
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);
// Has Password Using Pre Hok
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.BCRYPT_SALT_ROUNDS),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isExistUserByEmailOrNumber = async function (
  emailOrNumber: string,
) {
  return await User.findOne({ 
    $or:[{email: emailOrNumber}, {number: emailOrNumber}]
   }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Export Model
export const User = model<TUser, UserModel>('User', userSchema);
