import connection from '../dbStrategy/database.js'

export async function insertHashtag(text){
    return await connection.query(
        'INSERT INTO hashtags (text) VALUES ($1)',
        [text]
        );
}

export async function getOneHashtag(text){
    return await connection.query(
        'SELECT id FROM hashtags WHERE text=$1',
        [text]
        );
}