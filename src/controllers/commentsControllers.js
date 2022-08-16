import { stripHtml } from "string-strip-html";
import { searchUserById } from "../repositories/usersRepository.js";
import { getOnePostById } from "../repositories/postRepository.js";
import { commentsRepository } from "../repositories/commentsRepository.js";

export async function createComment(req,res){
    const {userId} = res.locals;
    const {comment} = req.body; 
    const id = stripHtml(req.params.id)?.result.trim() || null;
    if(!id || isNaN(Number(id))) return res.status(422).send('Invalid postId sent!');
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