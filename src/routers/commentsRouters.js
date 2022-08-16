import { Router } from "express";
import { createComment } from "../controllers/commentsControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";
import validateSchemas from "../middlewares/validateSchemas.js";
import commentsSchema from "../schemas/commentsSchema.js"

const router = Router ();

router.post('/comments/create/:id', tokenVerify, validateSchemas(commentsSchema), createComment);

export default router;