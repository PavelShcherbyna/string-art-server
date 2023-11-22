import { Router } from 'express';
import {saveDrawnings} from "./drawingsController";
// import { test } from './drawingsController';

const router = Router();

// router.post('/test', test);
router.post('/save-drawings', saveDrawnings);

export default router;
