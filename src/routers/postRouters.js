import { Router } from "express";
import validateSchemas from "../middlewares/validateSchemas.js";
import postSchema from "../schemas/postSchema.js";
import {
    createPost,
    listAllPosts,
    listUserPosts,
    editPost,
    deletePost
} from "../controllers/postControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router();

router.post("/posts", validateSchemas(postSchema), tokenVerify, createPost)
router.get("/posts", tokenVerify, listAllPosts)
router.get("/timeline", tokenVerify, listUserPosts)
router.put("/posts/:id", tokenVerify, editPost)
router.delete("/posts/:id", tokenVerify, deletePost)

export default router