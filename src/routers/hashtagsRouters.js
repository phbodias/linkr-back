import { Router } from "express";
import tokenVerify from "../middlewares/tokenVerify.js";
import { getHashtags, getPostsByHashtag } from "../controllers/hashtagsControllers.js";

const router = Router();

router.get('/hashtags', tokenVerify, getHashtags);
router.get('/hashtags/:hashtag', tokenVerify, getPostsByHashtag);

export default router;