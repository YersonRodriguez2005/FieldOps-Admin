//Rutas de equipos, con control de acceso basado en roles (técnico y administrador)
const express = require("express");
const router = express.Router();
const { crearEquipo, obtenerEquipos, actualizarEquipo, actualizarEstadoEquipo, eliminarEquipo } = require("../controllers/equipos");
const { verificarToken, esAdministrador } = require("../middlewares/authMiddleware");

// Rutas
router.post("/", verificarToken, esAdministrador, crearEquipo);
router.get("/", verificarToken, obtenerEquipos);
router.put("/:id", verificarToken, esAdministrador, actualizarEquipo);
router.patch("/:id/estado", verificarToken, esAdministrador, actualizarEstadoEquipo);
router.delete("/:id", verificarToken, esAdministrador, eliminarEquipo);

module.exports = router;