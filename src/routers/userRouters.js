import Router from "express";
import {
  userByName,
  userById,
  getPostsUser,
  userLogged,
  followController,
  unfollowController,
  friendsController,
} from "../controllers/usersControllers.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = Router();

router.get("/busca/:name", tokenVerify, userByName);
router.get("/user/:id", tokenVerify, userById);
router.get("/me", tokenVerify, userLogged);
router.get("/posts/:id", tokenVerify, getPostsUser);
router.post("/follow/:friendId", tokenVerify, followController);
router.delete("/follow/:friendId", tokenVerify, unfollowController);
router.get("/follow", tokenVerify, friendsController)

export default router;
