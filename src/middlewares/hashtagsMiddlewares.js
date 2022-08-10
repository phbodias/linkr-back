import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

export async function createHashtags(_req,res,next){
    const {body}=res.locals;
    const {comment} = body;
    console.log(comment,!comment)
    if(!comment) {
        return next()
    };
        
    body.hashtags=getHashtagsFromComment(comment,next);

    const arrayIdsHashtags=[];

    try{
        for (const hash of body.hashtags){
            const hashtagExist = await existHashtag(hash);
            if(hashtagExist.length===0){
                const hashtagId = await hashtagsRepository.insertHashtags(hash);
                if(!hashtagId) return res.status(500).send("Something went wrong when inserting a new hastag");
                arrayIdsHashtags.push(hashtagId);
            }else{
                arrayIdsHashtags.push(hashtagExist[0].id);
            }
        }
        res.locals.body=body;
        res.locals.hashtagsId = arrayIdsHashtags;
        next();
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }    

}

function getHashtagsFromComment(comment,next){
    const hashtagsArray=comment.match(/#[A-z]{1,}(?=\W|$)/g);
        
    if(hashtagsArray.length===0){ 
        return next()
    }
    
    return hashtagsArray.map(hashtag =>{
        return hashtag.replace('#','').trim();
    });
}

async function existHashtag(hashtag){
    return await hashtagsRepository.selectHashtags(hashtag);
}

// function generatePatternHastag(string){
//     return new RegExp(`(?<=\\W|^|)#${string}(?=\\W|$)`, "g");
// }
