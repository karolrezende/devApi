import dotenv from 'dotenv'
import { Client } from 'pg'
dotenv.config()
const client: Client = new Client ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT!),
})

const startDatabase = async (): Promise<void>=>{
    await client.connect()
    console.log("Conexão realizada! s2")
}

export {client, startDatabase}