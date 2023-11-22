import { RequestHandler } from 'express';
import User, { IDrawing, IUser } from '../../../models/Users';
import { AppError } from '../../../utils/appError';

// export const test: RequestHandler = async (req, res, next) => {
//   try {
//     console.log('req.body:', req.body);
//     console.log('req.user:', req.user);
//     console.log('req.headers:', req.headers);
//
//     return res.status(200).json({ success: true }).end();
//   } catch (error) {
//     next(error);
//   }
// };

export const saveDrawnings: RequestHandler = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body);
    // console.log('req.user:', req.user);
    // console.log('req.headers:', req.headers);

    const user = req.user;
    const { drawings } = req.body as { drawings: IDrawing[] };

    if (!drawings || drawings.length < 1) {
      return next(new AppError('Drawings are missing', 400));
    }

    let drawingsToSave = [];

    if (user.drawings) {
      drawingsToSave = user.drawings.filter((el) => {
        return !drawings.some((d) => {
          return d.f_id === el.f_id;
        });
      });

      drawingsToSave = [...drawingsToSave, ...drawings];
      // drawings.forEach((draw) => {
      //   let oldDraw = {};
      //
      //   if (user.drawings) {
      //     oldDraw = user.drawings.find((el) => el.f_id === draw.f_id) || {};
      //   }
      //
      //   drawingsToSave.push({ ...oldDraw, ...draw });
      // });
    } else {
      drawingsToSave = [...drawings];
    }

    while (drawingsToSave.length > 2) {
      drawingsToSave.shift();
    }

    const UpdatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { drawings: drawingsToSave } },
      { new: true }
    );

    return res.status(200).json({
      status: 'success',
      user: UpdatedUser
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
