import { Router } from 'express';
import postRouters from './postRouters.js';
import hashtagsRouters from './hashtagsRouters.js';
import authRouters from './authRouters.js';
import userRouters from './userRouters.js';
import commentsRouters from './commentsRouters.js';

const router = Router();

router.use([authRouters, postRouters, hashtagsRouters, userRouters, commentsRouters]);

export default router;
