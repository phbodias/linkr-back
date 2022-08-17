import joi from 'joi';

const postSchema = joi.object({
    url:joi.string().uri().required(),
    description:joi.string().min(0)
});

export default postSchema