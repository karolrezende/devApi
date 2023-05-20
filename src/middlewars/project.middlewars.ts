import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { Tproject } from "../interfaces/project.interface";
import { QueryConfig, QueryResult } from "pg";

const ensureProjectExists = async (req: Request, res: Response, next: NextFunction): Promise<Response|void> =>{
    const id: number = Number(req.params.id)

    const queryString: string = `
        SELECT * 
        FROM projects
        WHERE id = $1;
    `

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }
    const queryResult: QueryResult<Tproject> = await client.query(QueryConfig)
    
    if(queryResult.rowCount === 0){
        return res.status(404).json({
            message: "Project not found"
        })
    }
    next()
}


export {ensureProjectExists}