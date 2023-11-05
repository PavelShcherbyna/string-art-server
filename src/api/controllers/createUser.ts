import { RequestHandler } from 'express';
import User from '../../models/Users';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    console.log('req.body:', req.body);
    const { email, password, name } = req.body;

    const user = await User.create({
      email,
      password,
      name
    })

    return res.status(200).json(user).end();
  } catch (error) {
    console.log('ERROR', error);
    next(error);
  }
};

export default createUser;
