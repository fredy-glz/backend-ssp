import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
    static login = async (req: Request, res: Response) => {
        // Comprueba si el nombre de usuario y la contraseña existen
        let {username, password} = req.body;
        console.log(username)
        console.log(password)
        if (!(username && password)) {
            res.status(400).send();
        }

        // Obtener usuario de la base de datos
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            res.status(401).send();
        }

        // Comprueba si la contraseña cifrada coincide
        if (!user.checkIfUnencryptedPasswordIsValid(password)){
            res.status(401).send();
            return;
        }

        // Sing JWT, valido por 1 hora
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        // Enviar el jwt en la respuesta
        return res.status(200).json({ "token": token });
        //res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {
        // Obtener ID de JWT
        const id = res.locals.jwtPayload.userId;

        // Obtener parametros del cuerpo
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        } 

        // Obtener usuario de la base de datos
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send();
        }

        // Comprueba si la contraseña anterior coincide
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        // Validar el modelo (longitud de contraseña)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0){
            res.status(400).send(errors);
            return;
        }

        // Hash la nueva contraseña y guardar
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    };
}

export default AuthController;