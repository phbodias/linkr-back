import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

export async function gethashtags(_req,res){
    try{
        const hashtags = await hashtagsRepository.selectAllHashtags();
        return res.status(200).send(hashtags);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}
