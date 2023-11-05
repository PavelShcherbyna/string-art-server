import { RequestHandler } from 'express';
import { AppError } from '../../utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../../models/Users';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
  }
}

const secretKey: string = process.env.JWT_SECRET || '';

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not authorized!', 401));
    }

    const { id } = jwt.verify(token, secretKey) as JwtPayload;

    const currentUser = await User.findById(id);

    if (!currentUser) {
      return next(new AppError("User doesn't exist", 401));
    }

    req.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
};
