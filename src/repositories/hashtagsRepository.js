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
export async function selectPostsByHashtag(hashtag,limit,offset) {
    try {

        const { rows: postsRaw } = await connection.query(`
        SELECT 
        u.id as "userId",
        u.name,
        u."profilePic" as picture, 
        p.description,
        p."urlTitle",
        p."urlDescription",
        p."urlImage",
        p."urlLink",
        p.id as "postId"
        FROM posts p 
        LEFT JOIN users u ON u.id = p."userId"
        LEFT JOIN "hashtagPosts" hp ON hp."postId" = p.id
        LEFT JOIN hashtags h ON h.id = hp."hashtagId"
        LEFT JOIN likes l ON l."postId"=p.id
        LEFT JOIN shared s ON s."postId"=p.id
        WHERE h.text=$1
        GROUP BY p.id, u.id
        LIMIT $2 OFFSET $3
        `, 
        [hashtag,limit,offset]
        );

        return await formatedPosts(postsRaw);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}


export async function formatedPosts(posts) {
    if (posts) {
        for (const post of posts) {
            const { rows: likes } = await getLikeByPostId(post.postId);
            const { rows: shared } = await getRepostsByPostId(post.postId);
            post.likes = likes
            post.shared = shared
        }
        const newPost = posts.map(p=>({
                postId:p.postId,
                userOwner: {
                    id:p.userId,
                    name:p.name,
                    picture:p.picture
                },
                description:p.description,
                urlData: {
                    title:p.urlTitle,
                    urlDescription:p.urlDescription,
                    image:p.urlImage,
                    url:p.urlLink
                },
                likesCount:p.likes.length,
                likes:p.likes,
                repostCount:p.shared.length,
                repostedBy:{
                    id:p.repostedBy,
                    name:p.repostedByName
                }
            }))
    return newPost;
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