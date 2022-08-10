import { Router } from 'express';
import authRouters from './authRouters.js';
import postRouters from './postRouters.js';
import userRouters from './userRouters.js'

const router = Router();
router.use(authRouters);
router.use(postRouters);
router.use(userRouters)

export default router
