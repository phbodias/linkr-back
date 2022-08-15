import connection from "../dbStrategy/database.js";

export async function getLikeByPostId (postId) {
    return await connection.query(
        `SELECT users.name 
        FROM likes
        JOIN users ON users.id=likes."userLikedId"
        WHERE likes."postId"=$1`,
        [postId]
        )
}

export async function deleteLikeLink(id){
    return await connection.query(
        'DELETE FROM likes WHERE "postId"=$1',
        [id]
    )
}

export async function likePost(userId, postId) {
    try {
      return await connection.query(
        'INSERT INTO likes ("postId", "userLikedId") VALUES ($1, $2)',
        [postId, userId]
      );
    } catch (e) {
      return res.status(500).send("erro no repo");
    }
  }