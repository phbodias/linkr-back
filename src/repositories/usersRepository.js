import connection from "../dbStrategy/database.js";
import { formatedPosts } from './hashtagsRepository.js';


export async function searchUserByName(name) {

    return await connection.query(
        `SELECT * FROM users 
         WHERE users.name ILIKE $1 || '%'`,
        [name]);

}

export async function searchUserById(id) {

    return await connection.query(
        `SELECT id, name, "profilePic" FROM users
         WHERE id = $1`,
        [id]);

}


export async function getPostsByUserId(userId) {
    try {

        const { rows: postsRaw } = await connection.query(
            `SELECT JSON_AGG(item) AS posts
            FROM (
            SELECT JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'picture', u."profilePic"
            ) AS "userOwner", 
            p.description,
            JSON_BUILD_OBJECT(
                'title', p."urlTitle",
                '"urlDescription"', p."urlDescription",
                'image', p."urlImage",
                'url', p."urlLink"
                ) AS "urlData",
            p.id as "postId",
            COUNT(l.id) as "likesCount",
            COUNT(s.id) as "repostCount"
            FROM posts p
            LEFT JOIN users u ON u.id=p."userId"
            LEFT JOIN likes l ON l."postId"=p.id
            LEFT JOIN shared s ON s."postId"=p.id
            WHERE p."userId"=$1
            GROUP BY p.id, u.id
            ORDER BY p."createdAt" DESC
            LIMIT 20
            ) item `,
            [userId]
        );

        return await formatedPosts(postsRaw[0].posts);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}