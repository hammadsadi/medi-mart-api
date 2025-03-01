import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.types';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { User } from '../modules/user/user.model';


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // Check Token
    if (!token) {
      throw new AppError(401, 'You are Not Authorized!');
    }
    // Verify Token
    const decode = jwt.verify(
      token,
      config.JWT_ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload;
    const { userEmail } = decode;

    // Find And Check User
    const user = await User.isExistUserByEmailOrNumber(userEmail)
    if (!user) {
      throw new AppError(404, 'User Not Found!');
    }
    // Check Role
    if (requiredRoles && !requiredRoles.includes(user?.role)) {
      throw new AppError(401, 'You are Not Authorized!');
    }
    req.user = decode;
    next();
  });
};

export default auth;
