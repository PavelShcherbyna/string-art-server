import dotenv from 'dotenv';
import Server from './common/server.js';
import { routes, publicRoutes } from './api/routes'

dotenv.config();

const port = parseInt(process.env.PORT ?? '4000');

new Server().router(routes, publicRoutes).listen(port);
// new Server().router( ).listen(port);
