import jwt from 'jsonwebtoken';

const SECRET = process.env.TOKEN_SECRET || 'secret'

export default function tokenVerify(req, res, next) {
    const token = req.headers.authorization || null;
    if (!token) {
        return res.sendStatus(401);
    }
    const user = jwt.verify(token?.replace("Bearer ", ""),SECRET);
    if (!user) {
        return res.sendStatus(401);
    } else {
        res.locals.authUser = user;
        next();
    }
}