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

export {ensureDevExists}