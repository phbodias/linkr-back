import { insertPost } from "../repositories/postRepository.js";

export async function createPost (req,res) {
    const authUser = res.locals.authUser
    try {
        await insertPost(req.body.url,req.body.comment, authUser.id);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listAllPosts () {

}

export async function editPost () {

}

export async function deletePost () {
    
}