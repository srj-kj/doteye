import express from 'express';

import { getAverage, getQoutes, getSlippage } from '../controller/postController';

const router = express.Router()


router.get("/quotes", getQoutes );
router.get("/average", getAverage );
router.get("/slippage", getSlippage );


export default router;