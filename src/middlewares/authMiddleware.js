import connection from "../dbStrategy/database.js";

export async function registerMiddleware(req, res, next) {
  const user = req.body;
  if (user.pictureUrl){
    const validUrl = checkUrl(user.pictureUrl);
    if (!validUrl) return res.status(422).send("Envie uma imagem válida, ou não envie nenhuma!")
  }
  try {
    const userExists = await connection.query(
      `SELECT * FROM users
        WHERE email = $1;`,
      [user.email]
    );
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
    const user = await connection.query(
      `SELECT * FROM users
            WHERE email=$1;`,
      [requisite.email]
    );
    if (user.rows.length === 0) {
      return res.status(401).send("Usuário Inexistente");
    }

    res.locals.user = user.rows[0];

    next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

function checkUrl(string) {
  try {
    let url = new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
