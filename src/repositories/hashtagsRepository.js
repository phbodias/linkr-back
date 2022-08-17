import connection from "../dbStrategy/database.js"
import { getLikeByPostId } from "./likesRepository.js"
import { getRepostsByPostId } from "./postRepository.js";


export async function insertHashtags(item) {
    const { rows: insertedHashtag } = await connection.query(`
    INSERT INTO hashtags (text) 
    VALUES($1)
    RETURNING id`, [item])
    return insertedHashtag[0].id;
}

export async function selectHashtags(item) {
    const { rows: existingHashtag } = await connection.query(`
    SELECT id 
    FROM hashtags
    WHERE text = $1`,
        [item]);
    return existingHashtag;
}

export async function getHashtagByPostId(postId) {
    return await connection.query(
        `SELECT hashtags.text 
        FROM "hashtagPosts" 
        JOIN hashtags ON hashtags.id="hashtagPosts"."hashtagId" 
        WHERE "hashtagPosts"."postId"=$1`,
        [postId]
    );
}

export async function selectAllHashtags() {
    const { rows: hashtags } = await connection.query(`
    SELECT h.text 
    FROM hashtags h
    JOIN "hashtagPosts" hp
    ON h.id = hp."hashtagId"
	GROUP BY h.text
    ORDER BY COUNT(hp."hashtagId") DESC`);
    return hashtags;
}

export async function insertHashtagsPosts(postId, hashtagId) {
    const { rowCount } = await connection.query(`
        INSERT INTO "hashtagPosts"
        ("postId", "hashtagId")
        VALUES
        ($1,$2)`
        , [postId, hashtagId]
    );
    return rowCount;
}

export async function verifyPostHashtags(postId, hashtagId) {
    return await connection.query(
        'SELECT * FROM "hashtagPosts" WHERE "postId"=$1 AND "hashtagId"=$2',
        [postId, hashtagId]
    );
}

export async function deleteHashtagLink(postId) {
    return await connection.query(
        'DELETE FROM "hashtagPosts" WHERE "postId"=$1',
        [postId]
    )
}
export async function selectPostsByHashtag(hashtag) {
    try {

        const { rows: postsRaw } = await connection.query(`
        SELECT JSON_AGG(item) AS posts
        FROM (
        SELECT JSON_BUILD_OBJECT(
        'id', u.id,
        'name', u.name,
        'picture', u."profilePic"
        ) AS "userOwner", 
        p.description,
        JSON_BUILD_OBJECT(
            'title', p."urlTitle",
            'description', p."urlDescription",
            'image', p."urlImage",
            'url', p."urlLink"
            ) AS "urlData",
        p.id as "postId",
        COUNT(l.id) as "likesCount",
        COUNT(s.id) as "repostCount"
        FROM posts p 
        LEFT JOIN users u ON u.id = p."userId"
        LEFT JOIN "hashtagPosts" hp ON hp."postId" = p.id
        LEFT JOIN hashtags h ON h.id = hp."hashtagId"
        LEFT JOIN likes l ON l."postId"=p.id
        LEFT JOIN shared s ON s."postId"=p.id
        WHERE h.text=$1
        GROUP BY p.id, u.id
        ) item `, [hashtag]
        );

        return await formatedPosts(postsRaw[0].posts);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}


export async function formatedPosts(posts) {
    if (posts) {
        for (const post of posts) {
            const { rows: likes } = await getLikeByPostId(post.postId);
            const { rows: reposts } = await getRepostsByPostId(post.postId);
            post.likes = likes;
            post.reposts = reposts;
        }
    return posts;
    } else {
        return [];
    }
}


export const hashtagsRepository = {
    insertHashtags,
    selectHashtags,
    insertHashtagsPosts,
    selectAllHashtags,
    selectPostsByHashtag,
    getHashtagByPostId,
    deleteHashtagLink,
    verifyPostHashtags
}