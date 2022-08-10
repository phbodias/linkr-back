import { Router } from "express";
import tokenVerify from "../middlewares/tokenVerify.js";
import { gethashtags } from "../controllers/hashtagsControllers.js";

const router = Router();

router.get('/hashtags', tokenVerify, gethashtags);

export default router;