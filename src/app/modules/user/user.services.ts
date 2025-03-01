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



// Get All Users From DB
const getAllUserFromDB = async () =>{
  const users = await User.find()
  return users
}

// Get Single User From DB
const getSingleUserFromDB = async (id:string) =>{
  const user = await User.findById(id)
  return user
}

// Update User Personal Info From DB
const updateUserPersonalInfoFromDB = async (email:string, payload:Partial<TUser>) =>{
  const user = await User.findOneAndUpdate({email}, payload, {new:true})
  return user
}

//  User Block By Admin 
const userblockByAdmin = async (id: string, payload: { status:string }) => {
  const user = await User.findByIdAndUpdate(id, payload, {new:true});
  return user;
};
export const UserServices = {
  userSaveToDatabase,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserPersonalInfoFromDB,
  userblockByAdmin,
};
