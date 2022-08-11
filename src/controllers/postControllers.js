import urlMetadata from 'url-metadata';
import {
    insertPost,
    getPostsByUserId,
    getAllPosts,
    getOnePostById,
    verifyPostHashtags,
    updatePost,
    deleteOnePost
} from "../repositories/postRepository.js";

import { hashtagsRepository } from "../repositories/hashtagsRepository.js";
import {
    getLikeByPostId,
    deleteLikeLink
} from "../repositories/likesRepository.js";



export async function createPost(_, res) {
    const userId = res.locals.userId
    const { body } = res.locals;
    const { hashtagsId } = res.locals;
    try {
        const { rows: postInserted } = await insertPost(body.url, body.comment, userId);
        const postId = postInserted[0].id;
        if (hashtagsId) {
            for (const id of hashtagsId) {
                const rowCount = await hashtagsRepository.insertHashtagsPosts(postId, id);
                if (rowCount === 0) return res.status(500).send("Something went wrong when adding new values to hashtagsPosts table");
            }
        }
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function listUserPosts(_, res) {
    const userId = res.locals.userId
    try {
        const posts = await getPostsByUserId(userId);
        const formattedPosts = await formatPost(posts)
        res.status(200).send(formattedPosts)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listAllPosts(_, res) {
    try {
        const posts = await getAllPosts();
        const formattedPosts = await formatPost(posts.rows)
        res.status(200).send(formattedPosts)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function editPost(req, res) {
    const userId = res.locals.userId
    const postId = req.params.id
    try {
        const foundPost = await getOnePostById(postId);
        if (foundPost.rows[0].userId === userId) {
            await updatePost(req.body.url, req.body.comment, postId);
            if (req.body.hashtags) {
                req.body.hashtags.map(async (h) => {
                    hashtagId = await hashtagsRepository.selectHashtags(h);
                    if (hashtagId.rows.length === 0) {
                        await hashtagsRepository.insertHashtags(h);
                        hashtagId = await hashtagsRepository.selectHashtags(h);
                        await hashtagsRepository.insertHashtagsPosts(postId, hashtagId.rows[0].id);
                    } else {
                        const foundLink = await verifyPostHashtags(postId, hashtagId.rows[0].id);
                        if (foundLink.rows.length === 0) {
                            await hashtagsRepository.insertHashtagsPosts(postId, hashtagId.rows[0].id);
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

export async function deletePost(req, res) {
    const userId = res.locals.userId
    const postId = req.params.id
    try {
        const foundPost = await getOnePostById(postId);
        if(foundPost.rows.length===0){
            return res.sendStatus(404)
        }
        if (foundPost.rows[0].userId !== userId) {
            return res.sendStatus(401);
        }
            await deleteOnePost(postId);
            await hashtagsRepository.deleteHashtagLink(postId);
            await deleteLikeLink(postId);
            res.sendStatus(204)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


async function formatPost(posts) {
    let hashtags
    let likes
    let urlInfo
    let formattedPosts = []
    for(let i=0; i<posts.length; i++) {
        hashtags = await hashtagsRepository.getHashtagByPostId(posts[i].postId);
        likes = await getLikeByPostId(posts[i].postId);
        if (posts[i].postUrl) {
            urlInfo = await urlMetadata(posts[i].postUrl).then(
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
            urlInfo = {
                title: "",
                description: "",
                url: "",
                image: ""
            }
        }
        
        formattedPosts.push({
            userName: posts[i].userName,
            profilePic: posts[i].profilePic,
            postUrl: urlInfo,
            postComment: posts[i].postComment,
            hashtags: hashtags.rows,
            likes: likes.rows
        })
    }
    return formattedPosts
}