import connection from "../dbStrategy/database.js";

export async function insertComments(userId, postId, text) {
    const { rowCount } = await connection.query(`
    INSERT INTO comments 
    ("userId", "postId", text)
    VALUES ($1,$2,$3)`,
        [userId, postId, text]
    );
    return rowCount;
}

export async function getCommentsOfPostById(userId, postId) {
    const { rows: results } = await connection.query(`
    SELECT  (CASE 
        WHEN c.id IS NOT NULL THEN
        (JSON_BUILD_OBJECT(
       'id', u.id,
       'name', u.name,
       'picture', u."profilePic"
       ) ) 
        END ) AS "userOwner",
   c.text, 
   (CASE 
    WHEN c."userId"=f1."friendId" AND f1."userId"=$1 THEN 'following'
    WHEN c."userId"=p."userId" THEN 'post''s author'
    ELSE '' 
    END
   ) as relation,
   c.id
   FROM comments c
   LEFT JOIN users u 
   ON u.id = c."userId"
   LEFT JOIN posts p
   ON p.id = c."postId"
   LEFT JOIN friends f1
   ON f1."friendId" = c."userId"
   WHERE "postId"=$2
   ORDER BY c."createdAt" DESC;`, [userId, postId]);
   const idResults= results.map(element=>element.id);

    const newIdsResults = idResults.filter((element, index) => {
    return idResults.indexOf(element) === index;
    });

    return newIdsResults.map(id=>{
    return results.find(r=> r.id === id)
    });

    
}



export async function getCommentsCountOfPostById(id) {
    const { rows: results } = await connection.query(`
    SELECT COUNT(id) AS "commentsCount"
    FROM comments
    WHERE "postId"=$1;`, [id]);
    return results[0];
}

export async function deleteComments(id){
    const {rowCount} = await connection.query(`
    DELETE FROM comments 
    WHERE comments."postId"=$1`,
    [id]);
    return rowCount;
}

export const commentsRepository = {
    insertComments,
    getCommentsOfPostById,
    getCommentsCountOfPostById,
    deleteComments
}