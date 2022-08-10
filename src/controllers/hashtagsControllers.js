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
    
    const hashtagText = req.params.hashtag;
    
    // try{
    //     const postsOfHashtag = await hashtagsRepository.selectHashtags(hashtagText);

    //     if(hashtag.length===0) return res.status(404).send(`There is no hashtag registered with ${hashtagText} name!`);
        
    //     return res.status(200).send(hashtag[0].text);    
    // }catch(err){
    //     console.log(err);
    //     return res.sendStatus(500);
    // }
}
