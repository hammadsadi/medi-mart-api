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


/**
 * @description Get All User Controllers
 * @param ''
 * @returns  Data
 */
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Retrieved Successful',
    data: result,
  });
});


/**
 * @description Get Single User Controller
 * @param 'userId'
 * @returns  Data
 */
const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleUserFromDB(req.params.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single User Retrieved Successful',
    data: result,
  });
});


/**
 * @description Update Single User Personal Information Controller
 * @param ''
 * @returns  Data
 */
const updateSingleUserPersonalInformation = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserPersonalInfoFromDB(
    req.user?.userEmail,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Information Updated Successful',
    data: result,
  });
});


/**
 * @description  User Block By Admin Controller
 * @param 'userId'
 * @returns  Data
 */
const userBlockByAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.userblockByAdmin(
    req.params.userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Status Updated Successful',
    data: result,
  });
});
export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateSingleUserPersonalInformation,
  userBlockByAdmin,
};
