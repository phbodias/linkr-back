import connection from '../dbStrategy/database.js'

export async function insertPost(url,comment,userId){
    return await connection.query(
        'INSERT INTO posts (url,comment,"userId") VALUES ($1,$2,$3)',
        [url,comment,userId]
        );
}

export async function getAllPosts(){
    return await connection.query(
        'SELECT * FROM posts'
    )
}

export async function getPostsByUserId (userId) {
    return await connection.query(
        'SELECT * FROM posts WHERE "userId"=$1',
        [userId]
    )
}