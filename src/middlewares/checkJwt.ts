import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Obtener el token jwt de la cabecera
    const token = <string>req.headers["auth"];
    let jwtPayload;

    // Intenta validar el token y obtener datos
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // si el token no es valido, responda con 401 (no autorizado)
        res.status(401).send();
        return;
    }

    // El token es valido por una hora
    // Queremos enviar un nuevo token en cada solicitud
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    // Llama al siguiente middleware o controlador
    next();
};