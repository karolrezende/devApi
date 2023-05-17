import app from "./app";
import { startDatabase } from "./database";
import "dotenv/config";
const appPort = 3000 ;

const server = (port: number) =>
  app.listen(port, async () => {
    await startDatabase();
    console.log(`Server foi iniciado! localhost:${port}.`);
  });

if (process.env.NODE_ENV === "dev") {
  server(appPort);
}

export default server;
