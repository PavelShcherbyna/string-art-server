import { Application } from 'express';
import authRouter from '../controllers/authController/index';
import drawningsRouter from '../controllers/drawningsController';
import codesRouter from '../controllers/accessCodesController'

export const publicRoutes = (app: Application) => {
  app.use('/api/v1', authRouter);
  app.use('/api/v1', codesRouter);
};

export const routes = (app: Application) => {
  app.use('/api/v1', drawningsRouter);
};
