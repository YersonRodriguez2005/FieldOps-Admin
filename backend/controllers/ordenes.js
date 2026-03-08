// Controlador para la logica de ordenes
// Datos: id, titulo, estado ('Pendiente','Activa','Completada'), fecha_creacion, fecha_programa, id_usuario.

const pool = require("../db/db");

// Crear orden (Administradores con múltiples equipos)
const crearOrden = async (req, res) => {
    // Extraemos equipos_seleccionados que ahora es un array
    const { titulo, fecha_programa, id_usuario, equipos_seleccionados } = req.body;
    
    try {
        // 1. Insertamos la orden (Ya NO usamos id_equipo en esta tabla)
        const [resultado] = await pool.query(
            "INSERT INTO ordenes (titulo, estado, fecha_creacion, fecha_programa, id_usuario) VALUES (?, 'Pendiente', NOW(), ?, ?)",
            [titulo, fecha_programa, id_usuario]
        );

        const idOrdenInsertada = resultado.insertId;

        // 2. LÓGICA PARA MÚLTIPLES EQUIPOS
        // Verificamos que sí hayan seleccionado equipos y que sea un array
        if (equipos_seleccionados && equipos_seleccionados.length > 0) {
            
            // Recorremos cada ID de equipo seleccionado
            for (let i = 0; i < equipos_seleccionados.length; i++) {
                let id_equipo_actual = equipos_seleccionados[i];

                // A) Guardamos la relación en la nueva tabla pivote
                await pool.query(
                    "INSERT INTO ordenes_equipos (id_orden, id_equipo) VALUES (?, ?)",
                    [idOrdenInsertada, id_equipo_actual]
                );

                // B) Cambiamos el estado de ese equipo específico a 'Asignado'
                await pool.query(
                    "UPDATE equipos SET estado = 'Asignado' WHERE id = ?",
                    [id_equipo_actual]
                );
            }
        }

        res.status(201).json({ 
            message: "Orden creada y equipos asignados exitosamente", 
            id: idOrdenInsertada 
        });
        
    } catch (err) {
        console.error("Error al crear orden múltiple:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener todas las ordenes (Administradores y Técnicos)
const obtenerOrdenes = async (req, res) => {
    try {
        // 1. Obtenemos todas las órdenes básicas
        const [ordenes] = await pool.query("SELECT * FROM ordenes");
        
        // 2. Obtenemos todas las relaciones de la tabla puente
        const [relaciones] = await pool.query("SELECT id_orden, id_equipo FROM ordenes_equipos");
        
        // 3. A cada orden le inyectamos un array con los IDs de sus equipos asignados
        const ordenesConEquipos = ordenes.map(orden => {
            const equiposAsignados = relaciones
                .filter(rel => rel.id_orden === orden.id)
                .map(rel => rel.id_equipo);
                
            return {
                ...orden,
                equipos_seleccionados: equiposAsignados // <-- El frontend leerá este array
            };
        });

        res.json(ordenesConEquipos);
    } catch (err) {
        console.error("Error al obtener ordenes:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar orden (Solo administradores)
const actualizarOrden = async (req, res) => {
    const { id } = req.params;
    let { titulo, estado, fecha_programa, id_usuario, equipos_seleccionados } = req.body;
    
    // Evitamos errores si vienen vacíos
    id_usuario = id_usuario === "" ? null : id_usuario;
    // Asegurarnos de que equipos_seleccionados siempre sea un Array (lista)
    const equiposNuevos = Array.isArray(equipos_seleccionados) ? equipos_seleccionados : [];

    try {
        // 1. Actualizamos los datos básicos de la orden
        await pool.query(
            "UPDATE ordenes SET titulo = ?, estado = ?, fecha_programa = ?, id_usuario = ? WHERE id = ?",
            [titulo, estado, fecha_programa, id_usuario, id]
        );

        // 2. Buscamos TODOS los equipos que tenía esta orden en la tabla puente
        const [equiposViejos] = await pool.query("SELECT id_equipo FROM ordenes_equipos WHERE id_orden = ?", [id]);
        
        // 3. Liberamos esos equipos viejos (los pasamos a 'Disponible')
        for (let i = 0; i < equiposViejos.length; i++) {
            await pool.query("UPDATE equipos SET estado = 'Disponible' WHERE id = ?", [equiposViejos[i].id_equipo]);
        }

        // 4. Limpiamos la tabla puente para empezar en blanco con esta orden
        await pool.query("DELETE FROM ordenes_equipos WHERE id_orden = ?", [id]);

        // 5. Si la orden NO está completada, asignamos los equipos nuevos
        if (estado !== 'Completada') {
            for (let i = 0; i < equiposNuevos.length; i++) {
                let id_equipo = equiposNuevos[i];
                
                // Creamos la nueva relación
                await pool.query("INSERT INTO ordenes_equipos (id_orden, id_equipo) VALUES (?, ?)", [id, id_equipo]);
                
                // Cambiamos el estado en el inventario
                await pool.query("UPDATE equipos SET estado = 'Asignado' WHERE id = ?", [id_equipo]);
            }
        }

        res.json({ message: "Orden actualizada y múltiples equipos sincronizados" });
        
    } catch (err) {
        console.error("Error al actualizar orden:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar estado de la orden (Solo técnicos)
const actualizarEstadoOrden = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
        // 1. Actualizamos el estado de la orden
        const [resultado] = await pool.query(
            "UPDATE ordenes SET estado = ? WHERE id = ?",
            [estado, id]
        );
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        // 2. LÓGICA DE INVENTARIO: Si el técnico marca la orden como Completada, liberamos todas las herramientas
        if (estado === 'Completada') {
            const [equipos] = await pool.query("SELECT id_equipo FROM ordenes_equipos WHERE id_orden = ?", [id]);
            
            for (let i = 0; i < equipos.length; i++) {
                await pool.query("UPDATE equipos SET estado = 'Disponible' WHERE id = ?", [equipos[i].id_equipo]);
            }
        }

        res.json({ message: "Estado de la orden actualizado y herramientas sincronizadas" });
        
    } catch (err) {
        console.error("Error al actualizar estado de la orden:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar orden (Solo administradores)
const eliminarOrden = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Buscamos TODOS los equipos asignados antes de borrar la orden
        const [equipos] = await pool.query("SELECT id_equipo FROM ordenes_equipos WHERE id_orden = ?", [id]);

        // 2. Eliminamos la orden 
        // (Al tener ON DELETE CASCADE en la tabla pivote, sus registros se borrarán automáticamente)
        const [resultado] = await pool.query("DELETE FROM ordenes WHERE id = ?", [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "No se pudo eliminar la orden" });
        }

        // 3. LÓGICA DE INVENTARIO: Liberamos todos los equipos encontrados
        for (let i = 0; i < equipos.length; i++) {
            await pool.query("UPDATE equipos SET estado = 'Disponible' WHERE id = ?", [equipos[i].id_equipo]);
        }

        res.json({ message: "Orden eliminada y todos los equipos liberados correctamente" });
        
    } catch (err) {
        console.error("Error al eliminar orden:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    crearOrden,
    obtenerOrdenes,
    actualizarOrden,
    actualizarEstadoOrden,
    eliminarOrden
};