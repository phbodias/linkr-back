import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertNewUser } from "../repositories/authRepository.js";

export async function registerController(req, res) {
  try {
    const user = req.body;
    const password = bcrypt.hashSync(user.password, 10);
    await insertNewUser(user.name, user.email, password, user.profilePic);
    const token = await createToken(user, user.password);
    if (!token) return res.status(401).send("Senha ou email incorretos!");
    return res.status(201).send({ token });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function loginController(req, res) {
  const requisite = req.body;
  const user = res.locals.user;

  try {
    const token = await createToken(user, requisite.password);
    if (!token) return res.status(401).send("Senha ou email incorretos!");
    return res.status(200).send({ token });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function createToken(user, password) {
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "12h",
    });
    return token;
  } else {
    return false;
  }
}
