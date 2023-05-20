import { Request, Response } from "express";
import { TpatchProject, TpatchProjectRequest, Tproject, TprojectRequest } from "../interfaces/project.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import moment from "moment";

const createProject = async (req: Request, res: Response): Promise<Response> => {
    const reqBody: TprojectRequest = req.body
      
    console.log(req.body)
    const queryString: string = format(`
        INSERT INTO projects
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(reqBody),
    Object.values(reqBody)
    )
    const queryResult: QueryResult<Tproject> = await client.query(queryString)
    
    return res.status(201).json(queryResult.rows[0])
}
const getProjectById = async (req: Request, res: Response): Promise<Response> =>{
    const id:number = Number(req.params.id)
    const queryString: string = `
        SELECT 
            p."id" "projectId",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime" ,
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            p."developerId" "projectDeveloperId",
            t.id "technologyId" ,
            t.name "technologyName"
        FROM projects p
        LEFT JOIN technologies t
        ON 
            p.id = t.id
        WHERE 
            p.id = $1;
    `

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }
    const queryResult: QueryResult<Tproject> = await client.query(QueryConfig)

    return res.status(200).json(queryResult.rows)
}

const patchProject = async (req: Request, res: Response): Promise<Response> =>{
    const reqBody: TpatchProjectRequest = req.body
    const id: number = Number(req.params.id)

    if (req.body.hasOwnProperty("id")){
        return res.status(404).json({
            message: "project not found"
        })
    }
    const queryString: string = format(`
        UPDATE
            projects
        SET 
            (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
        `,
        Object.keys(reqBody),
        Object.values(reqBody)
    )

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult<TpatchProject> = await client.query(QueryConfig)
    return res.status(200).json(queryResult.rows[0])

}

const deleteProject = async (req: Request, res: Response): Promise<Response> =>{
    const id: number = Number(req.params.id)

    const queryString: string = `
        DELETE FROM
            projects
        WHERE 
            id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig)

    return res.sendStatus(204)
}

const createProjectTechnologie = async (req: Request, res: Response): Promise<Response> =>{
    const id: number = Number(req.params.id)
    const name: string = req.body.name
    ///AQUI IRA VERIFICAR SE A TECHNOLOGIA COM O NOME SOLICITADO EXISTE
    const queryTechString: string= `
        SELECT * 
        FROM technologies
        WHERE name = $1;
    `
    const queryTechConfig: QueryConfig = {
        text: queryTechString,
        values: [name]
    }
    const queryTechResult: QueryResult = await client.query(queryTechConfig)
    if(queryTechResult.rowCount===0){
        return res.status(400).json({
            message: "technologie not found",
            options: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
              ]
        })
    }
    //AQUI IRÁ VERIFICAR SE A TECNOLOGIA JA EXISTE NUM PROJETO 
    const queryTechProjString: string = `
        SELECT *  
        FROM projects_technologies
        WHERE 
            "technologyId" = $1 and "projectId" = $2
    `
    const queryTechProjConfig: QueryConfig = {
        text: queryTechProjString,
        values: [queryTechResult.rows[0].id, id]
    }
    const queryTechProjResult: QueryResult = await client.query(queryTechProjConfig)
    console.log(queryTechProjResult)
    if(queryTechProjResult.rowCount > 0){
        return res.status(409).json({
            message: "This technologie is already in use in this project"
        })
    }
   //APOS PASSAR ALI, IRA INSERIR NA TABEELA PROJECTSTECHNLGOIES 
    const myBody = {
        addIn: moment().format('YYYY-MM-DD'),
        technologyId: queryTechResult.rows[0].id,
        projectId: id
    }
    const queryString: string = format(`
        INSERT INTO projects_technologies
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(myBody),
    Object.values(myBody)
    )
    await client.query(queryString)
    //E AQUI IRA MANDAR O JOSON UNINDOS AS TRES TABELAS
    const queryResString: string = `
    select 
        t."id" "technologyId",
        t."name" "technologyName",
        p.id "projectId",
        p."name" "projectName",
        p."description" "projectDescription",
        p."estimatedTime" "projectEstimatedTime",
        p."repository" "projectRepository",
        p."startDate" "projectStartDate",
        p."endDate" "projectEndDate"
        from projects p
        inner join 
            projects_technologies pt on p.id = pt."projectId"
        inner join 
            technologies t on t.id = pt."technologyId" 
        where 
            p. id = $1;
    `
    const queryResConfig: QueryConfig = {
        text: queryResString,
        values: [id]
    }

    const queryResResult: QueryResult = await client.query(queryResConfig)

    return res.status(201).json(queryResResult.rows[0])
}
const deleteProjectTechnology = async (req: Request, res: Response ): Promise<Response> => {
    const id: number = Number(req.params.id)
    const name: string = req.params.name
    ///AQUI IRA VERIFICAR SE A TECHNOLOGIA COM O NOME SOLICITADO EXISTE
    const queryTechString: string= `
        SELECT * 
        FROM technologies
        WHERE name = $1;
    `
    const queryTechConfig: QueryConfig = {
        text: queryTechString,
        values: [name]
    }
    const queryTechResult: QueryResult = await client.query(queryTechConfig)
    if(queryTechResult.rowCount===0){
        return res.status(400).json({
            message: "technologie not found",
            options: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
              ]
        })
    }

    //AQUI IRÁ VERIFICAR SE o PROJETO EXSTE 
    const queryProjString: string = `
        SELECT *  
        FROM projects
        WHERE 
            id = $1
    `
    const queryProjConfig: QueryConfig = {
        text: queryProjString,
        values: [id]
    }
    const queryProjResult: QueryResult = await client.query(queryProjConfig)
    console.log(queryProjResult)
    if(queryProjResult.rowCount === 0){
        return res.status(404).json({
            message: "project not found"
        })
    }
    //verifica se a tech esta cadastrada ao projeto

    const queryTecProString : string = `
    select from 
        projects_technologies
    WHERE 
        "technologyId" = $1 and "projectId" = $2;
    `
    const queryTecProConfig: QueryConfig = {
        text: queryTecProString,
        values: [queryTechResult.rows[0].id, queryProjResult.rows[0].id ]
    }
    const queryTecProResult: QueryResult  = await client.query(queryTecProConfig)

    if(queryTecProResult.rowCount ===0){
        return res.status(400).json({
            message: "Project not found"
        })
    }
    const queryDelString : string = `
        DELETE from 
            projects_technologies
        WHERE 
            "technologyId" = $1 and "projectId" = $2;
    `
    const queryDelConfig: QueryConfig = {
        text: queryDelString,
        values: [queryTechResult.rows[0].id, queryProjResult.rows[0].id ]
    }
    await client.query(queryDelConfig) 
    return res.sendStatus(204)
}
export {createProject, getProjectById, patchProject, deleteProject, createProjectTechnologie, deleteProjectTechnology}