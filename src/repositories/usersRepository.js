import connection from "../dbStrategy/database.js";


export async function searchUserByName(name){

        return await connection.query(
        `SELECT * FROM users 
         WHERE users.name ILIKE $1 || '%'`, 
         [name]);

}

export async function searchUserById(id){

        return await connection.query(
        `SELECT * FROM posts 
         WHERE posts."userId" = $1`, 
         [id]);

}