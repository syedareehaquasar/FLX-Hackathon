import { reset } from "../controller/passwordReset.js";
import express from 'express';

const router = express.Router();

router.patch('/', reset);

export default router;