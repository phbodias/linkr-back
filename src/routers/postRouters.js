import { Router } from "express";
import validateSchemas from "../middlewares/validateSchemas.js";
import { createHashtags } from "../middlewares/hashtagsMiddlewares.js";
import postSchema from "../schemas/postSchema.js";
import postUpdateSchema from "../schemas/postUpdateSchema.js";
import {
    createPost,
    listAllPosts,
    editPost,
    deletePost,
    likePost
} from "../controllers/postControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router();

router.post("/posts", tokenVerify, validateSchemas(postSchema), createHashtags, createPost);
router.post("/likes", tokenVerify, likePost);
router.get("/posts", tokenVerify, listAllPosts);
router.put("/posts/:id", tokenVerify, validateSchemas(postUpdateSchema), createHashtags, editPost);
router.delete("/posts/:id", tokenVerify, deletePost);

export default router;