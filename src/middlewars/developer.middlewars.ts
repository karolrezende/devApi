import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

//middleware para verificar se o dev existe
const ensureDevExists = async (req: Request, res: Response, next: NextFunction): Promise<Response|void> =>{
    const id: number = Number(req.params.id)

    const queryString: string = `
        SELECT * 
        FROM developers
        WHERE id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }
    
    const queryResult : QueryResult = await client.query(queryConfig)

    if(queryResult.rowCount === 0){
        return res.status(404).json({message: "developer not found"}) // caso não exista retorna essa msg
    }

    next() //senão ele da next
}
const ensureMailExists = async (req: Request,res: Response, next: NextFunction): Promise<Response|void> =>{
    const mail = req.body.email

    const queryStringMail: string = `
        SELECT *
        FROM 
            developers
        WHERE
            email = $1;
    `

    const queryConfigMail: QueryConfig = {
        text: queryStringMail,
        values: [mail]
    }

    const queryResultMail: QueryResult = await client.query(queryConfigMail)
    if(queryResultMail.rowCount > 0){
        return res.status(409).json({
            message: "Email already exists >:("
        })
    }
    next()
}
export {ensureDevExists ,ensureMailExists}