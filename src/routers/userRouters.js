import Router  from "express";
import { userByName, userById } from "../controllers/usersControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router()

router.get("/busca/:name",tokenVerify, userByName)
router.get("/user/:id", userById)

export default router