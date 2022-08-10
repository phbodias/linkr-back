import urlMetadata from 'url-metadata';
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

 import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

import {
    getHashtagByPostId,
    getHashtagByText,
    insertHashtag
} from "../repositories/hashtagRepository.js";
import { getLikeByPostId } from "../repositories/likesRepository.js";



export async function createPost(req, res) {
    const authUser = res.locals.authUser
    const {body}=res.locals;
    const {hashtagsId} = res.locals;
    try {
        const {rows:postInserted} = await insertPost(body.url, body.comment, authUser.id);
        const postId = postInserted[0].id;
        for (const id of hashtagsId){
            const rowCount = await hashtagsRepository.insertHashtagsPosts(postId,id);
            if(rowCount===0) return res.status(500).send("Something went wrong when adding new values to hashtagsPosts table");
        }
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function listUserPosts(_, res) {
    const authUser = res.locals.authUser
    try {
        const posts = await getPostsByUserId(authUser.id);
        const formattedPosts = formatPost(posts)            
        res.status(200).send(formattedPosts)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listAllPosts(_, res) {
    try {
        const posts = await getAllPosts();
        const formattedPosts = formatPost(posts)
        res.status(200).send(formattedPosts)
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
                    hashtagId = await getHashtagByText(h);
                    if (hashtagId.rows.length === 0) {
                        await insertHashtag(h);
                        hashtagId = await getHashtagByText(h);
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

export async function deletePost(req, res) {
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


function formatPost (posts) {
    let hashtags
    let likes
    let urlInfo
    const formattedPosts = posts.rows.map(async (p) => {
        hashtags = await getHashtagByPostId(p.postId)
        likes = await getLikeByPostId(p.postId)
        urlInfo = urlMetadata(p.url).then(
        function (metadata) {
            return ({
                title:metadata.title,
                description:metadata.description,
                url:metadata.url,
                image:metadata.image
            })
        },
        function (error) {
            console.log(error)
            return ({})
        })
        return ({
            userName: p.userName,
            profilePic: p.profilePic,
            postUrl: urlInfo,
            postComment: p.postComment,
            hashtags: hashtags.rows,
            likes: likes.rows
        })
    })
    return formattedPosts
}