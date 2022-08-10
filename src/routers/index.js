import { Router } from 'express';
import postRouters from './postRouters.js';
import hashtagsRouters from './hashtagsRouters.js';

const router = Router();

router.use([postRouters, hashtagsRouters]);

export default router;
