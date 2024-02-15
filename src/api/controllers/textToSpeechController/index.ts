import { Router } from 'express';
import { postTextToSpeech } from './textToSpeechController';

const router = Router();

router.post('/text-to-speech', postTextToSpeech);

export default router;
