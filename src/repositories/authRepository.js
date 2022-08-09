import connection from "../dbStrategy/database.js";

export async function verifyUserExistent(email) {
  return await connection.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `,
    [email]
  );
}

export async function insertNewUser(name, email, password, profilePic) {
  return await connection.query(
    `INSERT INTO users 
     (name, email, password, "profilePic") 
     VALUES ($1, $2, $3, $4);`,
    [name, email, password, profilePic]
  );
}
