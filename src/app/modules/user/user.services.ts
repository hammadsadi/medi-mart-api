import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/auth.utils';
import { User } from './user.model';
import { TUser } from './user.types';

// User Save To Database
const userSaveToDatabase = async (userInfo: TUser) => {
  // Check User
  const isExistUser = await User.findOne({ email: userInfo.email });
  if (isExistUser) {
    throw new AppError(400, 'User Already Exist!');
  }
  const user = await User.create(userInfo);

  const userPayload = {
    userEmail: user?.email,
    accountStatus: user?.status,
    role: user?.role,
  };
  const token = createToken(
    userPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );
  return { user, accessToken: token };
};

// User Save To Database
// const usergetFromDatabase = async () => {
//   const user = await User.find();

//   return user;
// };
// User Update To Database
// const userUpdateFromDatabase = async (data: { status: string; id: string }) => {
//   const user = await User.findByIdAndUpdate(
//     data?.id,
//     { status: data?.status },
//     { new: true },
//   );

//   return user;
// };
export const UserServices = {
  userSaveToDatabase,
};
