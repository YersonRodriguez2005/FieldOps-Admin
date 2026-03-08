//Rutas para usuarios, con control de acceso basado en roles (técnico y administrador)
const express = require("express");
const router = express.Router();
const { verificarToken, esAdministrador } = require("../middlewares/authMiddleware");
const { 
  obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario 
} = require("../controllers/usuarios");

// LECTURA: El técnico puede entrar porque solo pedimos verificarToken
router.get("/", verificarToken, obtenerUsuarios);

// ESCRITURA: El técnico es rechazado aquí mismo por el middleware esAdministrador
router.post("/", verificarToken, esAdministrador, crearUsuario);
router.put("/:id", verificarToken, esAdministrador, actualizarUsuario);
router.delete("/:id", verificarToken, esAdministrador, eliminarUsuario);

module.exports = router;