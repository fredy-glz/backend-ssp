import { Router } from "express";
import UserController from "../controller/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Obtener todos los usuarios
router.get("/",  UserController.listAll);

// Consigue un usuario
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.getOneById
);

// Crear un nuevo usuario
router.post("/", UserController.newUser);

// Editar un usuario
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.editUser
)

// Eliminar un usuario
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])], 
    UserController.deleteUser
)

export default router;