import express, { Application, json} from "express";
import { ensureDevExists } from "./middlewars/developer.middlewars";
import { createDevelopers } from "./logics/developer.logics";

const app: Application = express()
app.use(json())

app.get('/developers/:id', ensureDevExists) //listar um desenvolvedor e seus projetos
app.post('/developers', createDevelopers) //cadastrar um desenvolvedor
app.post('/developers/:id/infos') //cadastrar informações sobre um desenvolvedor
app.patch('/developers/:id') //atualizar dados de um desenvolvedor
app.delete('/developers/:id') //deletar um desenvolvedor

export default app