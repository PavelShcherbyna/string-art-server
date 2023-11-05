import { Router } from 'express';
import { test } from './drawningsController';

const router = Router();

router.post('/test', test);

export default router;
