import { Router } from 'express';
import { getSongsList, getAudio } from './audioController';

const router = Router();

router.get('/songs-list', getSongsList);
router.get('/song/:fileName', getAudio);

export default router;
