import { Router } from "express";
import validateSchemas from "../middlewares/validateSchemas.js";
import postSchema from "../schemas/postSchema.js";
import {
    createPost, 
    listAllPosts, 
    editPost, 
    deletePost
} from "../controllers/postControllers.js";

const router = Router()

router.post("/posts", validateSchemas(postSchema), createPost)
router.get("/posts", listAllPosts)
router.put("/posts/:id", editPost)
router.delete("/posts/:id", deletePost)

export default router