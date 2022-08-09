import {
    insertPost,
    insertPostHashtags,
    getPostsByUserId,
    getAllPosts,
    getOnePost,
    getOnePostById,
    verifyPostHashtags,
    deleteOnePost,
    deleteHashtagLink,
    deleteLikeLink
} from "../repositories/postRepository.js";

import {
    getOneHashtag,
    insertHashtag
} from "../repositories/hashtagRepository.js";


export async function createPost(req, res) {
    const authUser = res.locals.authUser
    try {
        await insertPost(req.body.url, req.body.comment, authUser.id);
        if (req.body.hashtags) {
            const postId = await getOnePost(req.body.url, req.body.comment, authUser.id);
            let hashtagId
            req.body.hashtags.map(async (h) => {
                hashtagId = await getOneHashtag(h);
                if (hashtagId.rows.length === 0) {
                    await insertHashtag(h);
                    hashtagId = await getOneHashtag(h);
                }
                await insertPostHashtags(postId.rows[0].id, hashtagId.rows[0].id);
            });
        }
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listUserPosts(_, res) {
    const authUser = res.locals.authUser
    try {
        const posts = await getPostsByUserId(authUser.id);
        res.status(200).send(posts.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listAllPosts(_, res) {
    try {
        const posts = await getAllPosts()
        res.status(200); send(posts.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function editPost(req, res) {
    const authUser = res.locals.authUser
    const postId = req.params.id
    try {
        const foundPost = await getOnePostById(postId);
        if (foundPost.rows[0].userId === authUser.id) {
            await updatePost(req.body.url, req.body.comment, postId);
            if (req.body.hashtags) {
                req.body.hashtags.map(async (h) => {
                    hashtagId = await getOneHashtag(h);
                    if (hashtagId.rows.length === 0) {
                        await insertHashtag(h);
                        hashtagId = await getOneHashtag(h);
                        await insertPostHashtags(postId, hashtagId.rows[0].id);
                    } else {
                        const foundLink = await verifyPostHashtags(postId, hashtagId.rows[0].id);
                        if (foundLink.rows.length === 0) {
                            await insertPostHashtags(postId, hashtagId.rows[0].id);
                        }
                    }
                });
            }
            return res.sendStatus(200);
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deletePost(req,res) {
    const authUser = res.locals.authUser
    const postId = req.params.id
    try {
        const foundPost = await getOnePostById(postId);
        if (foundPost.rows[0].userId === authUser.id) {
            await deleteOnePost(postId);
            await deleteHashtagLink(postId);
            await deleteLikeLink(postId);
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}