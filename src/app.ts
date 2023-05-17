import express, { Application, json} from "express";
import { ensureDevExists, ensureMailExists } from "./middlewars/developer.middlewars";
import { createDevelopers, createDevelopersInfo, deleteDeveloper, getDevelopersById, patchDevelopers } from "./logics/developer.logics";

const app: Application = express()
app.use(json())

app.get('/developers/:id', ensureDevExists, getDevelopersById) //listar um desenvolvedor e seus projetos
app.post('/developers', ensureMailExists, createDevelopers) //cadastrar um desenvolvedor
app.post('/developers/:id/infos', ensureDevExists, createDevelopersInfo) //cadastrar informações sobre um desenvolvedor
app.patch('/developers/:id', ensureDevExists, ensureMailExists, patchDevelopers) //atualizar dados de um desenvolvedor
app.delete('/developers/:id', ensureDevExists, deleteDeveloper) //deletar um desenvolvedor

export default app