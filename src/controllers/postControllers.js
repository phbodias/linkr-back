import {
    insertPost,
    insertPostHashtags,
    getPostsByUserId,
    getAllPosts,
    getOnePost
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
                await insertHashtag(h);
                hashtagId = await getOneHashtag(req.body.hashtags);
                await insertPostHashtags(postId.rows[0].id, hashtagId.rows[0].id);
            })
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

export async function editPost() {

}

export async function deletePost() {

}