// backend/routes/dashboard.js
const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
const { obtenerMetricas } = require("../controllers/dashboard");

router.get("/metricas", verificarToken, obtenerMetricas);

module.exports = router;