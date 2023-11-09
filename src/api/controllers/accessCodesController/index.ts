import { Router } from 'express';
import {createCodes, getAllCodes} from "./accessCodesController";


const router = Router();

router.get('/create-codes', createCodes);
router.get('/get-codes', getAllCodes);


export default router;
