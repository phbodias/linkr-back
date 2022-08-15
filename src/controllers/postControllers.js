import {
  insertPost,
  getAllPosts,
  getOnePostById,
  updatePost,
  deleteOnePost,
} from "../repositories/postRepository.js";

import {
  formatedPosts,
  hashtagsRepository,
} from "../repositories/hashtagsRepository.js";
import { deleteLikeLink } from "../repositories/likesRepository.js";

export async function createPost(_, res) {
  const userId = res.locals.userId;
  const { body } = res.locals;
  const { hashtagsId } = res.locals;
  try {
    const { rows: postInserted } = await insertPost(
      body.url,
      body.comment,
      userId
    );
    const postId = postInserted[0].id;
    if (hashtagsId) {
      for (const id of hashtagsId) {
        const rowCount = await hashtagsRepository.insertHashtagsPosts(
          postId,
          id
        );
        if (rowCount === 0)
          return res
            .status(500)
            .send(
              "Something went wrong when adding new values to hashtagsPosts table"
            );
      }
    }
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function listAllPosts(_, res) {
  try {
    const posts = await getAllPosts();
    const formattedPosts = await formatedPosts(posts);
    res.status(200).send(formattedPosts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function editPost(req, res) {
  const userId = res.locals.userId;
  const postId = req.params.id;
  const { hashtagsId } = res.locals;
  try {
    const foundPost = await getOnePostById(postId);
    if (foundPost.rows[0].userId === userId) {
      await updatePost(req.body.comment, postId);
      if (hashtagsId) {
        for (const id of hashtagsId) {
          await hashtagsRepository.deleteHashtagLink(postId);
          const rowCount = await hashtagsRepository.insertHashtagsPosts(
            postId,
            id
          );
          if (rowCount === 0)
            return res
              .status(500)
              .send(
                "Something went wrong when adding new values to hashtagsPosts table"
              );
        }
      }
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const userId = res.locals.userId;
  const postId = req.params.id;
  try {
    const foundPost = await getOnePostById(postId);
    if (foundPost.rows.length === 0) {
      return res.sendStatus(404);
    }
    if (foundPost.rows[0].userId !== userId) {
      return res.sendStatus(401);
    }
    await hashtagsRepository.deleteHashtagLink(postId);
    await deleteLikeLink(postId);
    await deleteOnePost(postId);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function likePost(req, res) {
  const userId = res.locals.userId;
  const postId = req.body.id;
  try {
    await likePost(userId, postId);
  } catch (e) {
    return res.status(500).send(userId);
  }
}
