import postRouters from './postRouters.js';
import { Router } from 'express';

const router = Router();

router.use(postRouters);

export default router;
