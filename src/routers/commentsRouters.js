import { Router } from "express";
import { createComment } from "../controllers/commentsControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";
import { validateId } from "../middlewares/validateIdParams.js";
import validateSchemas from "../middlewares/validateSchemas.js";
import commentsSchema from "../schemas/commentsSchema.js";
import { listCommentsOfPost } from "../controllers/commentsControllers.js";

const router = Router ();

router.post('/comments/create/:id', tokenVerify, validateSchemas(commentsSchema), validateId ,createComment);
router.get('/comments/:id', tokenVerify, validateId, listCommentsOfPost );

export default router;