//middleware para verificar el token y el rol del usuario en las rutas protegidas
const JWT = require("jsonwebtoken");

// 1. Candado General: Verifica si el usuario tiene un token válido
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  // Extraemos el token quitando la palabra "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Desencriptamos el token usando tu palabra secreta del .env
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
    // Guardamos los datos (id, rol) en la request para que el controlador los pueda usar
    req.usuario = decoded; 
    
    next(); // El token es válido, dejamos pasar la petición
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

// 2. Candado Específico: Verifica si el usuario es Administrador
const esAdministrador = (req, res, next) => {
  // Verificamos el rol que sacamos del token en el paso anterior
  if (req.usuario.rol !== 'Administrador') {
    return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
  }
  
  next(); // Es Administrador, le damos permiso de crear, editar o borrar
};

module.exports = { verificarToken, esAdministrador };