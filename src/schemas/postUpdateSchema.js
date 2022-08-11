import joi from 'joi';

const postUpdateSchema = joi.object({
    comment:joi.string().min(0)
});

export default postUpdateSchema