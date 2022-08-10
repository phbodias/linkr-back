import connection from '../dbStrategy/database.js'

export async function insertHashtag(text){
    return await connection.query(
        'INSERT INTO hashtags (text) VALUES ($1)',
        [text]
        );
}

export async function getHashtagByText(text){
    return await connection.query(
        'SELECT id FROM hashtags WHERE text=$1',
        [text]
        );
}

export async function getHashtagByPostId(postId){
    return await connection.query(
        `SELECT hashtags.text 
        FROM "hashtagPosts" 
        JOIN hashtags ON hashtags.id="hashtagPosts"."hashtagId" 
        WHERE "hastagPosts"."postId"=$1`,
        [postId]
        );
}