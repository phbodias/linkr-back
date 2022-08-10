import { stripHtml } from "string-strip-html";

export default function (schema) {
    return (req,res,next) => {
        const body = req.body;
        
        
        for(const key of Object.keys(body) ){
            if(typeof[body[key]]!=='string') break;
            body[key]=stripHtml(body[key]).result.trim();
        };

        const {error} = schema.validate(body,{abortEarly:false});
        let message='';
        if(error){
            const errorMessages=error.details.map(item=>item.message);
            
            errorMessages.forEach(err=>{message+=`${err}\n`});
            return res.status(422).send(message);

        } else {
            res.locals.body=body;
            next();
        }
    
    }
}