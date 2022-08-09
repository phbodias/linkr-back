import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './application/setup.js';
import routers from './routers/index.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cors())

app.use(routers)

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`)
})