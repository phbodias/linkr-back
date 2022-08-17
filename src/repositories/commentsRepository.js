import connection from "../dbStrategy/database.js";

export async function insertComments(userId, postId, text){
    const {rowCount} = await connection.query(`
    INSERT INTO comments 
    ("userId", "postId", text)
    VALUES ($1,$2,$3)`,
    [userId,postId,text]
    );
    return rowCount;
}

export async function getCommentsOfPostById(id){
    const {rows:results} = await connection.query(`
    SELECT "userId", text
    FROM comments
    WHERE "postId"=$1
	ORDER BY "createdAt" DESC;`, [id]);
    return results;
}

export async function getCommentsCountOfPostById(id){
    const {rows:results} = await connection.query(`
    SELECT COUNT(id) AS "commentsCount"
    FROM comments
    WHERE "postId"=$1;`, [id]);
    return results[0];
}

export const commentsRepository = {
    insertComments,
    getCommentsOfPostById,
    getCommentsCountOfPostById
}