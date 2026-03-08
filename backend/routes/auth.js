//ruta para autenticacion de inicio de sesion
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

//ruta para iniciar sesion
router.post("/login", authController.login);

module.exports = router;
