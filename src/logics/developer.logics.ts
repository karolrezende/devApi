//POST DEVELOPERS

import { Request, Response } from "express";
import { TdeveloperRequest } from "../interfaces/developer.interface";
import format from "pg-format";

const createDevelopers = async (req: Request, res: Response): Promise<Response> =>{
    const devRequest: TdeveloperRequest = req.body
    
    const queryString: string = format(
        `
            INSERT INTO developers
            (%I) 
            VALUES (%L)
        `,
        Object.keys(devRequest),
        Object.values(devRequest)
    )
    return res.status(201).json(devRequest)
}

export {createDevelopers}