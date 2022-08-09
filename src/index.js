import express from 'express';
import cors from 'cors';
import './application/setup.js';
import routers from './routers/index.js';

const app = express();

app.use([express.json,cors(),routers]);

const PORT = process.env.PORT || 4001;

app.listen(PORT,()=>{
    console.log(`Mode: ${process.env.MODE || "DEV"}`);
    console.log(`Listening on ${process.env.PORT} port`)
});