import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

/**
 * @description Create User Controllers
 * @param ''
 * @returns Token and Data
 */
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.userSaveToDatabase(req.body);
  res.cookie('medi_mart_token', result?.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 10,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Created Successful',
    data: result,
  });
});

// Get All User Controllers
// const getAllUser = catchAsync(async (req, res) => {
//   const result = await UserServices.usergetFromDatabase();
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User Retrieved Successful',
//     data: result,
//   });
// });

// Update  User Controllers
// const updateUser = catchAsync(async (req, res) => {
//   const result = await UserServices.userUpdateFromDatabase(req.body);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'User Status Updated Successful',
//     data: result,
//   });
// });

export const UserControllers = {
  createUser,
};
