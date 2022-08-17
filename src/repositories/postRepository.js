import connection from "../dbStrategy/database.js";
import urlMetadata from "url-metadata";
import { formatedPosts } from "./hashtagsRepository.js";

export async function insertPost(urlData, comment, userId) {
  const { title, description, url, image } = await generateUrlMetadata(urlData);

  return await connection.query(
    `INSERT INTO posts 
        ("urlTitle","urlDescription","urlLink","urlImage",comment,"userId") 
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [title, description, url, image, comment, userId]
  );
}

export async function getOnePostById(id) {
  return await connection.query("SELECT * FROM posts WHERE id=$1", [id]);
}

export async function getAllPosts() {
  try {
    const { rows: postsRaw } = await connection.query(
      `SELECT JSON_AGG(item) AS posts
            FROM (
            SELECT JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'picture', u."profilePic"
            ) AS "userOwner", 
            p.description,
            JSON_BUILD_OBJECT(
                'title', p."urlTitle",
                'description', p."urlDescription",
                'image', p."urlImage",
                'url', p."urlLink"
                ) AS "urlData",
            p.id as "postId",
            COUNT(l.id) as "likesCount",
            COUNT(s.id) as "repostCount"
            FROM posts p
            LEFT JOIN users u ON u.id=p."userId"
            LEFT JOIN likes l ON l."postId"=p.id
            LEFT JOIN shared s ON s."postId"=p.id
            GROUP BY p.id, u.id
            ORDER BY p."createdAt" DESC
            LIMIT 20
            ) item `
    );

    return await formatedPosts(postsRaw[0].posts);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function updatePost(comment, id) {
  return await connection.query("UPDATE posts SET comment=$1 WHERE id=$2", [
    comment,
    id,
  ]);
}

export async function deleteOnePost(id) {
  return await connection.query("DELETE FROM posts WHERE id=$1", [id]);
}

export async function insertShared(userId,postId) {
  return await connection.query(
    `INSERT INTO shared ("userId","postId") VALUES ($1,$2)`, 
    [userId,postId]);
}
export async function getRepostsByPostId(postId) {
  return await connection.query(
    `SELECT users.name, users.id
        FROM shared
        JOIN users ON users.id=shared."userId"
        WHERE shared."postId"=$1`,
    [postId]
  );
}

async function generateUrlMetadata(url) {
  if (url) {
    return await urlMetadata(url).then(
      function (metadata) {
        return {
          title: metadata.title,
          description: metadata.description,
          url: metadata.url,
          image: metadata.image,
        };
      },
      function (error) {
        console.log(error);
        return {};
      }
    );
  } else {
    return {
      title: "",
      description: "",
      url: "",
      image: "",
    };
  }
}
