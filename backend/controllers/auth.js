const pool = require("../db/db");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

const login = async (req, res) => {
  const { correo, contrasena } = req.body; 

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const usuarioEncontrado = rows[0];

    // 1. COMENTADO BCRYPT TEMPORALMENTE
    const validcontrasena = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
    
    
    if (!validcontrasena) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const payload = {
      id: usuarioEncontrado.id,
      rol: usuarioEncontrado.ocupacion 
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" }); 
    
    res.json({ 
        token, 
        nombre: usuarioEncontrado.nombre,
        ocupacion: usuarioEncontrado.ocupacion,
        usuario: { 
          nombre: usuarioEncontrado.nombre, 
          rol: usuarioEncontrado.ocupacion_rol
        } 
    });

  } catch (err) {
    console.error("Error completo:", err);
    res.status(500).json({ 
        message: "Error interno del servidor",
        detalle: err.message
    });
  }
};

module.exports = { login };