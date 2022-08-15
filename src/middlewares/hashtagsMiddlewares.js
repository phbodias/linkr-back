import { hashtagsRepository } from "../repositories/hashtagsRepository.js";

export async function createHashtags(_req, res, next) {
    const { body } = res.locals;
    const { comment } = body;

    if (!comment) return next();

    body.hashtags = getHashtagsFromComment(comment);

    if (body.hashtags.length === 0) {
        return next()
    } else {
        const arrayIdsHashtags = [];

        try {
            for (const hash of body.hashtags) {
                const hashtagExist = await existHashtag(hash);
                if (hashtagExist.length === 0) {
                    const hashtagId = await hashtagsRepository.insertHashtags(hash);
                    if (!hashtagId) return res.status(500).send("Something went wrong when inserting a new hastag");
                    arrayIdsHashtags.push(hashtagId);
                } else {
                    arrayIdsHashtags.push(hashtagExist[0].id);
                }
            }
            res.locals.body = body;
            res.locals.hashtagsId = arrayIdsHashtags;
            next();
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }


}

function getHashtagsFromComment(comment) {
    const hashtagsArray = comment.match(/#[A-Z0-9-àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]{1,}(?=\W|$)/gi);

    if (!hashtagsArray || hashtagsArray.length === 0) {
        return [];
    }

    return hashtagsArray.map(hashtag => {
        return hashtag.replace('#', '').trim();
    });
}

async function existHashtag(hashtag) {
    return await hashtagsRepository.selectHashtags(hashtag);
}

// function generatePatternHastag(string){
//     return new RegExp(`(?<=\\W|^|)#${string}(?=\\W|$)`, "g");
// }
