import { Router } from 'express';
import { getInfoPagePhotoList } from './infoPageController';

const router = Router();

router.get('/info-page-photo-list', getInfoPagePhotoList);

export default router;
