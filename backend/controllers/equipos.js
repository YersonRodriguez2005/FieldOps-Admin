//Controlador para logica de equipos
//Datos: id, nombre, marca, estado, condicion, fecha_mantto.

const pool = require("../db/db");

// Crear equipo (Solo administradores - Protegido por Middleware en la ruta)
const crearEquipo = async (req, res) => {
    const { nombre, marca, estado, condicion, fecha_mantto } = req.body;
    try {
        const [resultado] = await pool.query(
            "INSERT INTO equipos (nombre, marca, estado, condicion, fecha_mantto) VALUES (?, ?, ?, ?, ?)",
            [nombre, marca, estado, condicion, fecha_mantto]
        );
        res.status(201).json({ 
            message: "Equipo creado exitosamente", 
            id: resultado.insertId 
        });
    } catch (err) {
        console.error("Error al crear equipo:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener todos los equipos (Administradores y Técnicos)
const obtenerEquipos = async (req, res) => {
    try {
        const [equipos] = await pool.query("SELECT * FROM equipos");
        res.json(equipos);
    } catch (err) {
        console.error("Error al obtener equipos:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar equipo
const actualizarEquipo = async (req, res) => {
    const { id } = req.params;
    const { nombre, marca, estado, condicion, fecha_mantto } = req.body;
    try {
        const [resultado] = await pool.query(
            "UPDATE equipos SET nombre = ?, marca = ?, estado = ?, condicion = ?, fecha_mantto = ? WHERE id = ?",
            [nombre, marca, estado, condicion, fecha_mantto, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        res.json({ message: "Equipo actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar equipo:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actuaizar estado del equipo (Disponible, En Uso, En Mantenimiento) (Solo administradores)
const actualizarEstadoEquipo = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const [resultado] = await pool.query(
            "UPDATE equipos SET estado = ? WHERE id = ?",
            [estado, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        res.json({ message: "Estado del equipo actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar estado del equipo:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar equipo (Solo administradores)
const eliminarEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const [resultado] = await pool.query("DELETE FROM equipos WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        res.json({ message: "Equipo eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar equipo:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    crearEquipo,
    obtenerEquipos,
    actualizarEquipo,
    actualizarEstadoEquipo,
    eliminarEquipo
};