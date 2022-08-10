import joi from 'joi';

const postSchema = joi.object({
    url:joi.string().uri().required(),
    comment:joi.string(),
    userId:joi.number().required()
});

export default postSchema