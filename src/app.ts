import express, { Application, json} from "express";
import { ensureDevExists, ensureMailExists } from "./middlewars/developer.middlewars";
import { createDevelopers, createDevelopersInfo, deleteDeveloper, getDevelopersById, patchDevelopers } from "./logics/developer.logics";
import { createProject, deleteProject, getProjectById, patchProject, createProjectTechnologie } from "./logics/project.logics";
import { ensureProjectExists } from "./middlewars/project.middlewars";

const app: Application = express()
app.use(json())

//developers routes
app.get('/developers/:id', ensureDevExists, getDevelopersById) //listar um desenvolvedor e seus projetos
app.post('/developers', ensureMailExists, createDevelopers) //cadastrar um desenvolvedor
app.post('/developers/:id/infos', ensureDevExists, createDevelopersInfo) //cadastrar informações sobre um desenvolvedor
app.patch('/developers/:id', ensureDevExists, ensureMailExists, patchDevelopers) //atualizar dados de um desenvolvedor
app.delete('/developers/:id', ensureDevExists, deleteDeveloper) //deletar um desenvolvedor

//projects routes
app.post('/projects',ensureDevExists, createProject)
app.get('/projects/:id',ensureProjectExists, getProjectById)
app.patch('/projects/:id', ensureDevExists, ensureProjectExists, patchProject)
app.delete('/projects/:id', ensureProjectExists, deleteProject)
app.post('/projects/:id/technologies', ensureProjectExists, createProjectTechnologie)
app.delete('/projects/:id/technologies/:name')

export default app