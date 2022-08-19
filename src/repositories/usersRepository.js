import connection from "../dbStrategy/database.js";
import { formatedPosts } from "./hashtagsRepository.js";

export async function searchUserByName(name) {
  return await connection.query(
    `SELECT * FROM users 
         WHERE users.name ILIKE $1 || '%'`,
    [name]
  );
}

export async function searchUserById(id) {
  return await connection.query(
    `SELECT id, name, "profilePic" FROM users
         WHERE id = $1`,
    [id]
  );
}

export async function getPostsByUserId(userId) {
  try {
    const { rows: postsRaw } = await connection.query(
      `SELECT 
            u.id as "userId",
            u.name,
            u."profilePic" as picture, 
            p.description,
            p."urlTitle",
            p."urlDescription",
            p."urlImage",
            p."urlLink",
            p.id as "postId",
            COUNT(l.id) as "likesCount",
            COUNT(s.id) as "repostCount"
            FROM posts p
            LEFT JOIN users u ON u.id=p."userId"
            LEFT JOIN likes l ON l."postId"=p.id
            LEFT JOIN shared s ON s."postId"=p.id
            WHERE p."userId"=$1
            GROUP BY p.id, u.id
            ORDER BY p."createdAt" DESC
            LIMIT 10`,
      [userId]
    );

    return await formatedPosts(postsRaw);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function follow(userId, friendId) {
  try {
    return await connection.query(
      'INSERT INTO friends ("userId", "friendId") VALUES ($1, $2)',
      [userId, friendId]
    );
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function alreadyFollow(userId, friendId) {
    try {
      return await connection.query(
        'SELECT * FROM friends WHERE "userId"=$1 AND "friendId"=$2',
        [userId, friendId]
      );
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

export async function unfollow(userId, friendId) {
  try {
    return await connection.query(
      'DELETE FROM friends WHERE "userId"=$1 AND "friendId"=$2',
      [userId, friendId]
    );
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function friendsFollow(userId) {
  try {
    return await connection.query(
      'SELECT "friendId" FROM "friends" WHERE "userId"=$1',
      [userId]
    );
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
