const pool = require("../db/db");
const bcrypt = require("bcrypt");

// Visualizacion de usuarios (administradores y tecnicos)
const obtenerUsuarios = async (req, res) => {
  try {
    // No seleccionamos la contraseña por seguridad
    const [rows] = await pool.query(
      "SELECT id, nombre, correo, ocupacion FROM usuarios"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Crear usuarios (Solo Administradores - Protegido por Middleware en la ruta)
const crearUsuario = async (req, res) => {
  const { nombre, correo, contrasena, ocupacion } = req.body;

  try {
    // 1. Verificar si el correo ya existe
    const [existe] = await pool.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    // 2. Encriptar la contraseña antes de guardarla
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(contrasena, saltRounds);

    // 3. Guardar en la base de datos
    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena, ocupacion) VALUES (?, ?, ?, ?)",
      [nombre, correo, passwordHash, ocupacion]
    );

    res.status(201).json({ 
      message: "Usuario creado exitosamente", 
      id: resultado.insertId 
    });

  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar usuario (Solo Administradores)
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, ocupacion } = req.body; // Asumimos que la contraseña no se cambia por aquí

  try {
    const [resultado] = await pool.query(
      "UPDATE usuarios SET nombre = ?, correo = ?, ocupacion = ? WHERE id = ?",
      [nombre, correo, ocupacion, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar usuario (Solo Administradores)
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // HARD DELETE: Eliminamos la fila físicamente de la tabla usuarios
    const [resultado] = await pool.query(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
    
  } catch (err) {
    // Protección profesional: Si el usuario ya está asignado a una Orden de Trabajo, 
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ 
            message: "No se puede eliminar este usuario porque tiene un historial de órdenes de trabajo asociadas." 
        });
    }

    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};