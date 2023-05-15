import express, { Application, json} from "express";
import { startDatabase } from "./database";

const app: Application = express()
app.use(json())
app.listen(3000, ()=>{
    console.log("Aplicação iniciada!")
    startDatabase()
})