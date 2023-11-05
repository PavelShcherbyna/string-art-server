import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RequestHandler, Response } from 'express';
import User, { IUser } from '../../../models/Users';
import { AppError } from '../../../utils/appError';

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = jwt.sign({ id: user._id?.toString() }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        email: user.email
      }
    }
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newUser = await User.create({
      email,
      password
    });

    createSendToken(newUser as IUser, 201, res);
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email: email }).select('+password').finally();

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect e-mail or password', 401));
    }

    createSendToken(user as IUser, 200, res);
  } catch (err) {
    next(err);
  }
};
