import Router  from "express";
import { userByName, userById,getPostsUser} from "../controllers/usersControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router()

router.get("/busca/:name",tokenVerify, userByName)
router.get("/user/:id", userById)
router.get("/me", tokenVerify, userById)
router.get("/posts/:id", getPostsUser)

export default router