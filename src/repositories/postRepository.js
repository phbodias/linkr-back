import connection from '../dbStrategy/database.js'

export async function insertPost(url,comment,userId){
    return await connection.query(
        'INSERT INTO posts (url,comment,"userId") VALUES ($1,$2,$3)',
        [url,comment,userId]
        );
}

export async function insertPostHashtags(postId,hashtagId){
    return await connection.query(
        'INSERT INTO hashtagPosts ("postId","hashtagId") VALUES ($1,$2)',
        [postId,hashtagId]
        );
}

export async function getOnePost(url,comment,userId){
    return await connection.query(
        'SELECT id FROM posts WHERE url=$1, comment=$2, "userId"=$3',
        [url,comment,userId]
    )
}

export async function getAllPosts(){
    return await connection.query(
        `SELECT users.name,
        users."profilePic",
        posts.url,
        posts.comment,
        hashtags.text,
        likes."userLikedId" FROM posts 
        LEFT JOIN users ON users.id=posts."userId"
        LEFT JOIN "hashtagPosts" ON posts.id="hashtagPosts"."postId"
        LEFT JOIN "hashtags" ON hashtags.id="hashtagPosts"."hashtagId"
        LEFT JOIN likes ON likes."postId"=posts.id`
    );
}

export async function getPostsByUserId (userId) {
    return await connection.query(
        `SELECT users.name,
        users."profilePic",
        posts.url,
        posts.comment,
        hashtags.text,
        likes."userLikedId" FROM posts 
        LEFT JOIN users ON users.id=posts."userId"
        LEFT JOIN "hashtagPosts" ON posts.id="hashtagPosts"."postId"
        LEFT JOIN "hashtags" ON hashtags.id="hashtagPosts"."hashtagId"
        LEFT JOIN likes ON likes."postId"=posts.id 
        WHERE posts."userId"=$1`,
        [userId]
    )
}