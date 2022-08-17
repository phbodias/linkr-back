import {
  searchUserByName,
  searchUserById,
  follow,
  unfollow,
  alreadyFollow,
  friendsFollow,
} from "../repositories/usersRepository.js";
import { getPostsByUserId } from "../repositories/usersRepository.js";

export async function userByName(req, res) {
  const { name } = req.params;

  console.log(name);
  try {
    const { rows: users } = await searchUserByName(name);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("catch error");
  }
}

export async function userById(req, res) {
  const { id } = req.params;

  try {
    const { rows: user } = await searchUserById(id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("catch error");
  }
}

export async function getPostsUser(req, res) {
  const { id } = req.params;

  try {
    const { rows: user } = await searchUserById(id);
    console.log(user);

    if (user.length === 0) {
      res.status(404).send("NOT HAVE A USER WITH THIS ID");
    }

    const posts = await getPostsByUserId(id);
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send("servidor crashou");
  }
}

export async function userLogged(req, res) {
  const userId = res.locals.userId;

  try {
    const { rows: user } = await searchUserById(userId);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("catch error");
  }
}

export async function followController(req, res) {
  const userId = res.locals.userId;
  const friendId = req.params.friendId;
  if (userId === friendId) return res.sendStatus(400);
  try {
    const { rows: already } = alreadyFollow(userId, friendId);
    if (already.length > 0) return res.sendStatus(400);
    await follow(userId, friendId);
    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function unfollowController(req, res) {
  const userId = res.locals.userId;
  const friendId = req.params.friendId;
  if (userId === friendId) return res.sendStatus(400);
  try {
    const { rows: already } = alreadyFollow(userId, friendId);
    if (already.length === 0) return res.sendStatus(400);
    await unfollow(userId, friendId);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function friendsController(req, res) {
  const userId = res.locals.userId;
  try {
    const { rows: friends } = await friendsFollow(userId);
    return res.status(200).send(friends);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
