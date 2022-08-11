import urlMetadata from 'url-metadata';
import connection from "../dbStrategy/database.js"
import {getLikeByPostId} from "./likesRepository.js"


export async function insertHashtags(item){
    const {rows:insertedHashtag} = await connection.query(`
    INSERT INTO hashtags (text) 
    VALUES($1)
    RETURNING id`, [item])
    return insertedHashtag[0].id;
}

export async function selectHashtags(item){
    const {rows:existingHashtag} = await connection.query(`
    SELECT id 
    FROM hashtags
    WHERE text = $1`,
    [item] );
    return existingHashtag;
}

export async function getHashtagByPostId(postId){
    return await connection.query(
        `SELECT hashtags.text 
        FROM "hashtagPosts" 
        JOIN hashtags ON hashtags.id="hashtagPosts"."hashtagId" 
        WHERE "hashtagPosts"."postId"=$1`,
        [postId]
        );
}

export async function selectAllHashtags(){
    const {rows : hashtags} = await connection.query(`
    SELECT h.text 
    FROM hashtags h
    JOIN "hashtagPosts" hp
    ON h.id = hp."hashtagId"
	GROUP BY h.text
    ORDER BY COUNT(hp."hashtagId") DESC`);
    return hashtags;
}

export async function insertHashtagsPosts(postId, hashtagId){
    const {rowCount} = await connection.query(`
        INSERT INTO "hashtagPosts"
        ("postId", "hashtagId")
        VALUES
        ($1,$2)`
        ,[postId, hashtagId]
    );
    return rowCount;
}

export async function deleteHashtagLink(postId){
    return await connection.query(
        'DELETE FROM "hashtagPosts" WHERE "postId"=$1',
        [postId]
    )
}

export async function selectPostsByHashtag(hashtag){
    try{
        
        const {rows: postsRaw} = await connection.query(`
            SELECT JSON_AGG(item) AS posts
            FROM (
            SELECT JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'picture', u."profilePic"
            ) AS "userOwner", 
            p.comment,
            p.url,
            p.id as "postId"
            FROM posts p 
            JOIN users u ON u.id = p."userId" 
            JOIN "hashtagPosts" hp ON hp."postId" = p.id
            JOIN hashtags h ON h.id = hp."hashtagId"
            WHERE h.text=$1
            GROUP BY p.id, u.id
            ) item `,[hashtag]
        );
        
        

        return await formatedPosts(postsRaw[0].posts);

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

async function formatedPosts(posts){
    for (const post of posts){
        const {rows: likes} = await getLikeByPostId(post.postId);
        post.likes=likes;
        const urlInfo = await generateUrlMetadata(post.url);
        delete post.url
        post.url =urlInfo;
        delete post.postId;
    }
    return posts;
}

async function generateUrlMetadata(url){
    if (url) {
        return await urlMetadata(url).then(
            function (metadata) {
                return ({
                    title: metadata.title,
                    description: metadata.description,
                    url: metadata.url,
                    image: metadata.image
                })
            },
            function (error) {
                console.log(error)
                return ({})
            })
    } else {
        return {
            title: "",
            description: "",
            url: "",
            image: ""
        }
    }
}

export const hashtagsRepository = { 
    insertHashtags,
    selectHashtags,
    insertHashtagsPosts,
    selectAllHashtags,
    selectPostsByHashtag,
    getHashtagByPostId,
    deleteHashtagLink
}