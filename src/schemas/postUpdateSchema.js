import joi from 'joi';

const postUpdateSchema = joi.object({
    description:joi.string().min(0)
});

export default postUpdateSchema;