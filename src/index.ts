import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes/index";

createConnection()
    .then(async connection => {
        // Crea una nueva instancia de la aplicacion express
        const app = express();

        // Llamar a middlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        // Establece todas las rutas desde la carpeta rutas
        app.use("/", routes);

        app.listen(3000, () => {
            console.log("Server on port 3000");
        });
    })
    .catch(error => console.log(error));

    