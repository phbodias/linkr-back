import joi from "joi";

const commentSchema = joi.object({
    comment:joi.string().min(1).required(),
});

export default commentSchema;