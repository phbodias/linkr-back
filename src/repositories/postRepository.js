import connection from '../dbStrategy/database.js'

export async function insertPost(url,comment,userId){
    return await connection.query(
        'INSERT INTO posts (url,comment,"userId") VALUES ($1,$2,$3) RETURNING id',
        [url,comment,userId]
        );
}

export async function getAllPosts(){
    return await connection.query(
        `SELECT users.name,
        "profilePicture"."imageUrl",
        posts.url,
        posts.comment,
        hashtags.text,
        likes."userLikedId" FROM posts 
        LEFT JOIN users ON users.id=posts."userId"
        LEFT JOIN "profilePicture" ON "profilePicture"."userId"=users.id
        LEFT JOIN "hashtagPosts" ON posts.id="hashtagPosts"."postId"
        LEFT JOIN "hashtags" ON hashtags.id="hashtagPosts"."hashtagId"
        LEFT JOIN likes ON likes."postId"=posts.id`
    );
}

export async function getPostsByUserId (userId) {
    return await connection.query(
        `SELECT users.name,
        "profilePicture"."imageUrl",
        posts.url,
        posts.comment,
        hashtags.text,
        likes."userLikedId" FROM posts 
        LEFT JOIN users ON users.id=posts."userId"
        LEFT JOIN "profilePicture" ON "profilePicture"."userId"=users.id
        LEFT JOIN "hashtagPosts" ON posts.id="hashtagPosts"."postId"
        LEFT JOIN "hashtags" ON hashtags.id="hashtagPosts"."hashtagId"
        LEFT JOIN likes ON likes."postId"=posts.id 
        WHERE posts."userId"=$1`,
        [userId]
    )
}