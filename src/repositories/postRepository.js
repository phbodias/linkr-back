import connection from "../dbStrategy/database.js";
import urlMetadata from "url-metadata";
import { formatedPosts } from "./hashtagsRepository.js";

export async function insertPost(urlData, description, userId) {
  const { title, urlDescription, url, image } = await generateUrlMetadata(urlData);
  return await connection.query(
    `INSERT INTO posts 
        ("urlTitle","urlDescription","urlLink","urlImage",description,"userId") 
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [title, urlDescription, url, image, description, userId]
  );
}

export async function getOnePostById(id) {
  return await connection.query("SELECT * FROM posts WHERE id=$1", [id]);
}

export async function getAllPosts(userId) {
  try {
    const { rows: postsRaw } = await connection.query(
      `(SELECT 
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
        COUNT(s.id) as "repostCount",
        NULL as "repostedByName",
        NULL as "repostedBy",
        p."createdAt"
        FROM posts p
        LEFT JOIN users u ON u.id=p."userId"
        LEFT JOIN likes l ON l."postId"=p.id
        LEFT JOIN shared s ON s."postId"=p.id
        LEFT JOIN friends f ON f."friendId"=p."userId"
        WHERE (f."userId"=$1 OR p."userId"=$1) 
        GROUP BY p.id, u.id
    
        UNION
        
        SELECT 
        u1.id as "userId",
        u1.name,
        u1."profilePic" as picture, 
        p.description,
        p."urlTitle",
        p."urlDescription",
        p."urlImage",
        p."urlLink",
        p.id as "postId",
        COUNT(l.id) as "likesCount",
        COUNT(s.id) as "repostCount",
        u2.name as "repostedByName",
        u2.id as "repostedBy",
        s."createdAt"
        FROM shared s
        LEFT JOIN posts p ON s."postId"=p.id
        LEFT JOIN users u1 ON u1.id=p."userId"
        LEFT JOIN likes l ON l."postId"=p.id
        LEFT JOIN friends f ON f."friendId"=s."userId"
        LEFT JOIN users u2 ON u2.id=s."userId"
        WHERE (f."userId"=$1 OR s."userId"=$1) 
        GROUP BY p.id, u1.id, s."createdAt", s."userId",u2.name,u2.id)
        ORDER BY "createdAt" DESC
      LIMIT 10`,
      [userId]
    );
    return await formatedPosts(postsRaw) ;
  } catch (err) {
    console.log(err);
  }
}

export async function updatePost(description, id) {
  return await connection.query("UPDATE posts SET description=$1 WHERE id=$2", [
    description,
    id,
  ]);
}

export async function deleteOnePost(id) {
  return await connection.query("DELETE FROM posts WHERE id=$1", [id]);
}

export async function insertShared(userId, postId) {
  return await connection.query(
    `INSERT INTO shared ("userId","postId") VALUES ($1,$2)`,
    [userId, postId]);
}

export async function deleteSharedLink(id) {
  return await connection.query('DELETE FROM shared WHERE "postId"=$1', [id]);
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
          urlDescription: metadata.description,
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
      urlDescription: "",
      url: "",
      image: "",
    };
  }
}
