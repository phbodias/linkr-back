import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

export async function getHashtags(_req,res){
    try{
        const hashtags = await hashtagsRepository.selectAllHashtags();
        return res.status(200).send(hashtags);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getPostsByHashtag (req,res){
    
    const hashtagText = req.params?.hashtag || null;
    if(!hashtagText) return res.status(422).send('Hashtag invalid!');

    try{
        const existHashtag = await hashtagsRepository.selectHashtags(hashtagText);
        if(existHashtag.length===0) return res.status(422).send('Hashtag invalid!');
        const posts = await hashtagsRepository.selectPostsByHashtag(hashtagText);
        if(!posts) return res.sendStatus(404);
        return res.status(200).send(posts);
           
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
   
}
