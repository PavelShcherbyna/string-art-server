import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RequestHandler, Response } from 'express';
import User, { IUser } from '../../../models/Users';
import { AppError } from '../../../utils/appError';
import AccessKeys, { IAccessKey } from '../../../models/AccessKeys';
import { decrypt } from '../../../helpers/crypto';

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = jwt.sign({ id: user._id?.toString() }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      drawings: user.drawings
      // email: user.email
    }
  });
};

// export const signup: RequestHandler = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//
//     const newUser = await User.create({
//       email,
//       password
//     });
//
//     createSendToken(newUser as IUser, 201, res);
//   } catch (err) {
//     next(err);
//   }
// };

// export const login: RequestHandler = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//
//     if (!email || !password) {
//       return next(new AppError('Please provide an email and password', 400));
//     }
//
//     const user = await User.findOne({ email: email }).select('+password').finally();
//
//     if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
//       return next(new AppError('Incorrect e-mail or password', 401));
//     }
//
//     createSendToken(user as IUser, 200, res);
//   } catch (err) {
//     next(err);
//   }
// };

export const loginWithCode: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return next(new AppError('Please provide password', 400));
    }

    const allEncodedCodes: IAccessKey[] = await AccessKeys.find();
    const allDecodedCodes = allEncodedCodes.map((el) => decrypt(el));

    if (!allDecodedCodes.includes(password)) {
      return next(new AppError('Please provide correct password', 400));
    }

    // const allUsers: IUser[] = await User.find({}, { _id: 1, password: 1 });

    // const usersDecrypted: IUser[] = await Promise.all(
    //   allUsers.map(async function (el: IUser): Promise<IUser> {
    //     return {
    //       _id: el._id,
    //       password: (await bcrypt.compare(password, el.password)) ? 'true' : 'false'
    //     };
    //   })
    // );
    // const userDecrypted: IUser | undefined = usersDecrypted.find(
    //   (el) => el.password === 'true'
    // );

    let user;

    user = await User.findOne({ code: password });

    if (!user) {
      // Field `password` is deprecated and is left for backward compatibility
      user = await User.create({ code: password, password });
    }
    

    // if (userDecrypted) {
    //   user = await User.findOne({ _id: userDecrypted._id });
    // } else {
    //   user = await User.create({ password });
    // }

    // if (!user) {
    //   return next(new AppError('There is some problem with login.', 401));
    // }

    createSendToken(user as IUser, 200, res);
  } catch (err) {
    next(err);
  }
};
