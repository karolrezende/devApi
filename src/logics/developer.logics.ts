//POST DEVELOPERS
import { Request, Response } from "express";
import { Tdeveloper, TdeveloperInfo, TdeveloperInfoRequest, TdeveloperRequest, TgetId, Tupdater, TupdaterRequest } from "../interfaces/developer.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const getDevelopersById = async (req: Request, res: Response): Promise<Response>=>{
    const id: number = Number(req.params.id)

    const queryString: string = `
    SELECT 
	    d.id "developerId",
	    d."name" "developerName" ,
	    d.email "developerEmail",
	    di."developerSince" "developerInfoDeveloperSince",
	    di."preferedOs" "developerInfoPreferredOS"
    FROM 
        developers d
    LEFT JOIN 
        developers_info di  
    ON 
        d.id = di."developerId"
    WHERE
        d.id = $1;

    `
    const queryConfig: QueryConfig ={
        text: queryString,
        values: [id]
    }
    const queryResult: QueryResult<TgetId> = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0])
}


const createDevelopers = async (req: Request, res: Response): Promise<Response> =>{
    const devRequest: TdeveloperRequest = req.body

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
    return res.status(201).json(queryResult.rows[0])
}

const patchDevelopers = async (req: Request, res: Response): Promise<Response> =>{
    const devData: TupdaterRequest = req.body
    const id: number = Number(req.params.id)
    const queryString: string = format (
        `
        UPDATE 
            developers
        SET
            (%I) = ROW(%L)
        WHERE   
            id = $1
        RETURNING *;
        `,
        Object.keys(devData),
        Object.values(devData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult<Tupdater> = await client.query(queryConfig)

    return res.status(200).json({
        "name": queryResult.rows[0].name,
        "email": queryResult.rows[0].email,
    })
}

const deleteDeveloper = async (req: Request, res: Response): Promise<Response> =>{
    const id: number = Number(req.params.id)

    const queryString: string = `
        DELETE FROM
            developers
        WHERE 
            id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig)

    return res.status(204)
}
const createDevelopersInfo = async (req: Request, res: Response): Promise<Response> =>{
    const id:number = Number(req.params.id)

    if (req.body.preferredOS != "Windows" && req.body.preferredOS !== "MacOS" && req.body.preferredOS !== "Linux"){
        return res.status(400).json({
            message: "bad request",
            options: ["Windows", "MacOS", "Linux"]
        })
    }

    const queryInfoString: string = `
        SELECT *
        FROM 
            developers_info
        WHERE 
            "developerId" = $1;

    `
    const queryInfoConfig: QueryConfig = {
        text: queryInfoString,
        values: [id]
    }
    const queryInfoResult: QueryResult<TdeveloperInfo> = await client.query(queryInfoConfig)

    if(queryInfoResult.rowCount > 0){
        return res.status(409).json({
            message: "this developer already have an info"
        })
    }
    const devResBody: TdeveloperInfoRequest = {
        ...req.body,
        developerId: id
    }
    const queryString: string = format(
        `
            INSERT INTO developers_info
                (%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(devResBody),
        Object.values(devResBody)
    )
    const queryResult: QueryResult<TdeveloperInfo> = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])
}
export {getDevelopersById, createDevelopers, patchDevelopers, deleteDeveloper, createDevelopersInfo}