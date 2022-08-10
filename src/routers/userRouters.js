import Router  from "express";
import { userByName } from "../controllers/usersControllers.js";

const router = Router()

router.get("/busca/:name", userByName)

export default router