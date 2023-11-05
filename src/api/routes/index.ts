import { Application } from 'express';
import authRouter from '../controllers/authController/index';
import drawningsRouter from '../controllers/drawningsController';

export const publicRoutes = (app: Application) => {
  app.use('/api/v1', authRouter);
};

export const routes = (app: Application) => {
  app.use('/api/v1', drawningsRouter);
};
