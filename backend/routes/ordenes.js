// Rutas para las ordenes con control de acceso basado en roles (técnico y administrador)
const express = require("express");
const router = express.Router();
const { verificarToken, esAdministrador,  } = require("../middlewares/authMiddleware");
const { 
    crearOrden, obtenerOrdenes, actualizarOrden, actualizarEstadoOrden, eliminarOrden
} = require("../controllers/ordenes");

router.get("/", verificarToken, obtenerOrdenes);
router.post("/", verificarToken, esAdministrador, crearOrden);
router.put("/:id", verificarToken, esAdministrador, actualizarOrden);
router.delete("/:id", verificarToken, esAdministrador, eliminarOrden);
router.patch("/:id/estado", verificarToken, actualizarEstadoOrden);

module.exports = router;