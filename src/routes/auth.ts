import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
// Ruta de inicio de sesion
router.post("/login", AuthController.login);

// Cambiar la contraseña
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
