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
        if(!posts) return res.sendStatus(204);
        return res.status(200).send(posts);
           
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
   
}

// SELECT JSON_AGG(item) 
// 	FROM (
// 		SELECT JSON_BUILD_OBJECT(
// 		'id', u.id,
// 		'name', u.name,
// 		'picture', u."profilePic"
// 	) AS "userOwner", p.comment, p.url 
//         FROM posts p JOIN users u ON u.id = p."userId" 
//         JOIN "hashtagPosts" hp ON hp."postId" = p.id
//         JOIN hashtags h ON h.id = hp."hashtagId"
//         GROUP BY p.id
//   ) item