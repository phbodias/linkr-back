import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  name: joi.string().min(2).required(),
  profilePic: joi.string().uri().required(),
});

export const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});
