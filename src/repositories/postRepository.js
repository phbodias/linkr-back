import connection from '../dbStrategy/database.js'

export async function insertPost(url,comment){
    return await connection.query(
        'INSERT INTO posts (url,comment) VALUES ($1,$2)',
        [url,comment]
        );
}
