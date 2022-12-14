import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './application/setup.js';
import routers from './routers/index.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000;

app.use([json(),cors(),routers]);

app.listen(PORT,()=>{
    console.log(`Mode: ${process.env.MODE || "DEV"}`);
    console.log(`Listening on ${process.env.PORT} port`)
});
