import { Router } from "express";
import validateSchemas from "../middlewares/validateSchemas.js";
import { createHashtags } from "../middlewares/hashtagsMiddlewares.js";
import postSchema from "../schemas/postSchema.js";
import postUpdateSchema from "../schemas/postUpdateSchema.js";
import {
    createPost,
    createRepost,
    listAllPosts,
    editPost,
    deletePost,
    likePost,
    deleteLike
} from "../controllers/postControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router();

router.post("/posts", tokenVerify, validateSchemas(postSchema), createHashtags, createPost);
router.get("/posts", tokenVerify, listAllPosts);
router.put("/posts/:id", tokenVerify, validateSchemas(postUpdateSchema), createHashtags, editPost);
router.delete("/posts/:id", tokenVerify, deletePost);

router.post("/likes", tokenVerify, likePost);
router.delete("/likes/:id", tokenVerify, deleteLike);
router.post("/repost/:id",tokenVerify,createRepost);

export default router;