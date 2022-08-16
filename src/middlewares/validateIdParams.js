import { stripHtml } from "string-strip-html";
export function validateId(req,res,next){
    const id = stripHtml(req.params.id)?.result.trim() || null;
    if(!id || isNaN(Number(id))) return res.status(422).send('Invalid postId sent!');
    res.locals.id = id;
    next();
}