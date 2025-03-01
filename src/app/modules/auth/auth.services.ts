import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/auth.utils';
import { User } from '../user/user.model';
import { TAuth } from './auth.types';

// Login User
const userLogin = async (payload: TAuth) => {
  // Check User
  const isExistUser = await User.isExistUserByEmailOrNumber(payload.identifier);
  if (!isExistUser) {
    throw new AppError(400, 'Invalid Credentials E');
  }

  // Match Password
  if (
    !(await User.isPasswordMatched(payload.password, isExistUser?.password))
  ) {
    throw new AppError(400, 'Invalid Credentials P');
  }

  // Create Payload
  const userPayload = {
    userEmail: isExistUser?.email,
    accountStatus: isExistUser?.status,
    role: isExistUser?.role,
  };

  // Create Token
  const token = createToken(
    userPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return { accessToken: token };
};

export const AuthServices = {
  userLogin,
};
