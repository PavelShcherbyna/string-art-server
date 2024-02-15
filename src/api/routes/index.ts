import { Application } from 'express';
import authRouter from '../controllers/authController/index';
import drawningsRouter from '../controllers/drawningsController';
import codesRouter from '../controllers/accessCodesController';
import audioRouter from '../controllers/audioController';
import infoPageRouter from '../controllers/infoPageController';
import textToSpeechRouter from '../controllers/textToSpeechController';

export const publicRoutes = (app: Application) => {
  app.use('/api/v1', authRouter);
  app.use('/api/v1', codesRouter);
  app.use('/api/v1', audioRouter);
  app.use('/api/v1', infoPageRouter);
};

export const routes = (app: Application) => {
  app.use('/api/v1', drawningsRouter);
  app.use('/api/v1', textToSpeechRouter);
};
