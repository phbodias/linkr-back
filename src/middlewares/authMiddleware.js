import connection from "../dbStrategy/database.js";
import { verifyUserExistent } from "../repositories/authRepository.js";

export async function registerMiddleware(req, res, next) {
  const user = req.body;
  try {
    const userExists = verifyUserExistent(user.email);
    if (userExists.rows.length > 0) {
      return res.status(409).send("Este email já foi cadastrado!");
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }

  next();
}

export async function loginMiddleware(req, res, next) {
  const requisite = req.body;

  try {
    const user = verifyUserExistent(requisite.email);
    if (user.rows.length === 0) {
      return res.status(401).send("Usuário Inexistente");
    }

    res.locals.user = user.rows[0];

    next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
