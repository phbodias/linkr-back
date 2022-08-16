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

export const commentsRepository = {
    insertComments,
}