//servidor donde se ejecutan las rutas y se conecta a la base de datos
const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");
const equiposRoutes = require("./routes/equipos");
const ordenesRoutes = require("./routes/ordenes");
const dashboardRoutes = require("./routes/dashboard");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

//ruta de autenticacion
app.use("/auth", authRoutes);
//ruta de usuarios
app.use("/usuarios", usuariosRoutes);
//ruta de equipos
app.use("/equipos", equiposRoutes);
//ruta de ordenes
app.use("/ordenes", ordenesRoutes);
//ruta de dashboard
app.use("/dashboard", dashboardRoutes);

//iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//validar conexion a la base de datos
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión a la base de datos exitosa");
    connection.release();
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });
