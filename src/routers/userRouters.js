import Router  from "express";
import { userByName, userById,getPostsUser, userLogged} from "../controllers/usersControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router()

router.get("/busca/:name",tokenVerify, userByName)
router.get("/user/:id", tokenVerify, userById)
router.get("/me", tokenVerify, userLogged)
router.get("/posts/:id", tokenVerify, getPostsUser)

export default router