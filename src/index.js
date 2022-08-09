import express from 'express';
import cors from 'cors';
import './application/setup.js';
import routers from './routers/index.js';

const app = express()

app.use(express.json())
app.use(cors())

app.use(routers)

app.listen(process.env.PORT,()=>{
    console.log(`Listening on ${process.env.PORT}`)
})