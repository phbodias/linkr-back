import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertNewUser } from "../repositories/authRepository.js";

export async function registerController(req, res) {
  try {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password, 10);
    await insertNewUser(user.name, user.email, user.password, user.profilePic);
    res.status(201).send("Usuário criado com sucesso!");
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export async function loginController(req, res) {
  const requisite = req.body;
  const user = res.locals.user;

  try {
    if (user && bcrypt.compareSync(requisite.password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: "12h",
      });
      return res.status(200).send({ token });
    } else {
      return res.status(401).send("Senha ou email incorretos!");
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
