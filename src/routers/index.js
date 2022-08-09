import { Router } from 'express';
import authRouters from './authRouters.js';
import postRouters from './postRouters.js';

const router = Router();
router.use(authRouters);
router.use(postRouters);

export default router
