import { 
    insertPost,
    getPostsByUserId,
    getAllPosts
 } from "../repositories/postRepository.js";

 import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

export async function createPost (_req,res) {
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



export async function listUserPosts (_,res) {
    const authUser = res.locals.authUser
    try {
        const posts = await getPostsByUserId(authUser.id);
        res.status(200).send(posts.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listAllPosts (_,res) {
    try {
        const posts = await getAllPosts()
        res.status(200);send(posts.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function editPost () {

}

export async function deletePost () {

}