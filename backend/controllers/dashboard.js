// backend/controllers/dashboardController.js
const pool = require("../db/db");

const obtenerMetricas = async (req, res) => {
    try {
        // Consultamos todas las métricas a la base de datos
        const [totalOrdenes] = await pool.query("SELECT COUNT(*) AS total FROM ordenes");
        const [ordenesCompletadas] = await pool.query("SELECT COUNT(*) AS total FROM ordenes WHERE estado = 'Completada'");
        const [ordenesPendientes] = await pool.query("SELECT COUNT(*) AS total FROM ordenes WHERE estado = 'Pendiente'");
        const [equiposMantenimiento] = await pool.query("SELECT COUNT(*) AS total FROM equipos WHERE estado = 'Mantenimiento'");
        // Contamos como técnicos activos a todos los que NO son Administradores
        const [tecnicosActivos] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE ocupacion != 'Administrador'");

        // Enviamos la respuesta consolidada al frontend
        res.json({
            totalOrdenes: totalOrdenes[0].total,
            ordenesCompletadas: ordenesCompletadas[0].total,
            ordenesPendientes: ordenesPendientes[0].total,
            equiposMantenimiento: equiposMantenimiento[0].total,
            tecnicosActivos: tecnicosActivos[0].total
        });
    } catch (err) {
        console.error("Error al obtener métricas:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = { obtenerMetricas };