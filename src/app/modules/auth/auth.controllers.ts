import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.services';

/**
 * @description Login Controllers
 * @param ''
 * @returns Token and Data
 */
const userLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.userLogin(req.body);
  res.cookie('medi_mart_token', result?.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 10,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Login Successful',
    data: result,
  });
});


/**
 * @description Loggedin User Controllers
 * @param ''
 * @returns  Data
 */
const loggedInUser = catchAsync(async (req, res) => {
  const result = await AuthServices.getLoginUserInfoFromDB(
    req?.user?.userEmail,
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'LoggedIn User Retrieved Successful',
    data: result,
  });
});
export const AuthControllers = {
  userLogin,
  loggedInUser,
};
