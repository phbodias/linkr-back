import pg from 'pg';

const { Pool } = pg;

let configDatabase;

if(process.env.MODE === "PROD"){
    configDatabase ={
        connectionString: process.env.DATABASE_URL
    };
    configDatabase.ssl = {
        rejectUnauthorized: false
    }
}

if(process.env.MODE==="DEV"){
    configDatabase ={
        connectionString: process.env.DATABASE_URL_DEV
    };
}

const connection = new Pool(
   configDatabase
);

export default connection;