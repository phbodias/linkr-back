import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connection from "../databases/postgres.js";

export async function registerController(req, res) {
  try {
    const user = req.body;

    user.password = bcrypt.hashSync(user.password, 10);
    await connection.query(
      `INSERT INTO users 
      (name, email, password) 
      VALUES ($1, $2, $3);`,
      [user.name, user.email, user.password]
    );

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
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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
