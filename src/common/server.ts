import express, { Application } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { verifyToken } from '../api/middlewares/authProtectMiddleware';
import { errorHandler } from '../api/middlewares/errorMiddleware';

const app = express();

export default class ExpressServer {
  constructor() {
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT ?? '100kb' }));

    app.use(cors());
  }

  router(routes: (app: Application) => void, publicRoutes: (app: Application) => void) {
    publicRoutes(app);
    app.use(verifyToken);
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port: number) {
    http.createServer(app).listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    return app;
  }
}
