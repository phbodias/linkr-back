
import { searchUserById } from "../repositories/usersRepository.js";
import { getOnePostById } from "../repositories/postRepository.js";
import { commentsRepository } from "../repositories/commentsRepository.js";

export async function createComment(req,res){
    const {userId} = res.locals;
    const {comment} = req.body; 
    const {id} = res.locals;
    try{
        const {rows:existUser} = await searchUserById(userId);
        if(existUser.length===0) return res.status(404).send("There isn't an user with this Id");
        const {rows: existPost} = await getOnePostById(id);
        if(existPost.length===0) return res.status(404).send("There is no post whith this Id");
        const rowCount = await commentsRepository.insertComments(userId, id, comment);
        if(rowCount===0 || !rowCount) return res.status(500).send("It was not possible to insert the new comment");
        return res.sendStatus(201); 
    }catch(err){
        console.log(err);
        return res.status(500).send('Error on createComment function on commentsControllers.js file');
    }
}

export async function listCommentsOfPost(_req,res){
    const {id} = res.locals;
    try{
        const {rows: existPost} = await getOnePostById(id);
        if(existPost.length===0) return res.status(404).send("There is no post whith this Id");
        const comments = await commentsRepository.getCommentsOfPostById(id);
        if(!comments) return res.status(500).send("Something went wrong on getting the comments");
        return res.status(200).send({comments, commentsCount: comments.length}); 
    }catch(err){
        console.log(err);
        return res.status(500).send('Error on listCommentsOfPost function on commentsControllers.js file');
    }
}