//POST DEVELOPERS
import { Request, Response } from "express";
import { Tdeveloper, TdeveloperRequest } from "../interfaces/developer.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDevelopers = async (req: Request, res: Response): Promise<Response> =>{
    const devRequest: TdeveloperRequest = req.body
    const mail = devRequest.email

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

    const queryString: string = format(
        `
            INSERT INTO developers 
                (%I) 
            VALUES 
                (%L)
            RETURNING *;
        `,
        Object.keys(devRequest),
        Object.values(devRequest)
    )
    const queryResult: QueryResult<Tdeveloper> = await client.query(queryString)
    console.log(queryResult)
    return res.status(201).json(queryResult.rows[0])
}

export {createDevelopers}