import React, { useState, useEffect } from "react";
import { crearOrden, actualizarOrden } from "../api/Ordenes";
import { obtenerUsuarios } from "../api/Usuarios";
import { obtenerEquipos } from "../api/Equipos";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Icons = {
  title:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25V4.75A1.75 1.75 0 0016.25 3H3.75zM3.5 4.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V4.75z" clipRule="evenodd" /><path d="M6 8.25a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 016 8.25zM6 11.25a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 016 11.25z" /></svg>,
  calendar: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>,
  status:   <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>,
  user:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>,
  tools:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 11-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 015.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 00-.025.627l1.398 1.398a.455.455 0 00.627-.025l2.691-2.692c.241-.241.647-.174.752.15.14.435.217.9.217 1.382zM4 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  save:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>,
  warn:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  check:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>,
};

// ─── Estados de orden ─────────────────────────────────────────────────────────
const ESTADO_OPTS = [
  { value: 'Pendiente',  color: 'text-amber-400   bg-amber-500/15   border-amber-500/30'   },
  { value: 'Activa',     color: 'text-sky-400     bg-sky-500/15     border-sky-500/30'      },
  { value: 'Completada', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
];

// ─── Campo genérico ───────────────────────────────────────────────────────────
const Field = ({ label, icon, hint, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      <span className="text-gray-600">{icon}</span>
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
  </div>
);

const inputBase = `w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5
  text-sm text-white placeholder-gray-600 outline-none transition-all duration-200
  hover:border-gray-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20`;

const selectBase = `w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5
  text-sm text-white outline-none transition-all duration-200
  hover:border-gray-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20`;

// ─── Componente ───────────────────────────────────────────────────────────────
const CrearOrdenes = ({ ordenExistente, onSuccess }) => {
  const [titulo,              setTitulo]              = useState(ordenExistente?.titulo      ?? "");
  const [estado,              setEstado]              = useState(ordenExistente?.estado      ?? "Pendiente");
  const [idTecnico,           setIdTecnico]           = useState(ordenExistente?.id_usuario  ?? "");
  const [equiposSeleccionados, setEquiposSeleccionados] = useState(
    ordenExistente?.equipos_seleccionados ?? []
  );
  const [fechaPrograma, setFechaPrograma] = useState(
    ordenExistente?.fecha_programa ? ordenExistente.fecha_programa.split('T')[0] : ""
  );

  const [listaTecnicos, setListaTecnicos] = useState([]);
  const [listaEquipos,  setListaEquipos]  = useState([]);
  const [cargandoListas, setCargandoListas] = useState(true);
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuarios = await obtenerUsuarios();
        setListaTecnicos(
          usuarios.filter(u =>
            u.ocupacion.toLowerCase() === 'técnico' || u.ocupacion.toLowerCase() === 'tecnico'
          )
        );
        const equipos = await obtenerEquipos();
        const equiposPermitidos = equipos.filter(eq => {
          if (eq.estado === 'Disponible') return true;
          if (ordenExistente?.equipos_seleccionados) {
            return ordenExistente.equipos_seleccionados.includes(eq.id);
          }
          return false;
        });
        setListaEquipos(equiposPermitidos);
      } catch {
        setError("Error al cargar técnicos o equipos. Recarga el formulario.");
      } finally {
        setCargandoListas(false);
      }
    };
    cargarDatos();
  }, [ordenExistente]);

  const toggleEquipo = (id) => {
    setEquiposSeleccionados(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const datosOrden = {
        titulo,
        estado,
        fecha_programa: fechaPrograma,
        id_usuario: idTecnico,
        equipos_seleccionados: equiposSeleccionados,
      };
      if (ordenExistente) {
        await actualizarOrden(ordenExistente.id, datosOrden);
      } else {
        await crearOrden(datosOrden);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la orden. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const tecnicoSeleccionado = listaTecnicos.find(t => String(t.id) === String(idTecnico));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Título */}
      <Field label="Título de la orden" icon={Icons.title}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.title}</span>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Ej. Revisión de cableado eléctrico"
            className={inputBase}
            required
          />
        </div>
      </Field>

      {/* Fecha */}
      <Field label="Fecha programada" icon={Icons.calendar}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.calendar}</span>
          <input
            type="date"
            value={fechaPrograma}
            onChange={e => setFechaPrograma(e.target.value)}
            className={inputBase}
            required
          />
        </div>
      </Field>

      {/* Estado — chips (solo al editar) */}
      {ordenExistente && (
        <Field label="Estado" icon={Icons.status}>
          <div className="flex gap-2 flex-wrap">
            {ESTADO_OPTS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEstado(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-95
                  ${estado === opt.value
                    ? `${opt.color} scale-105 shadow-sm`
                    : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                  }`}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </Field>
      )}

      {/* Técnico */}
      <Field label="Técnico encargado" icon={Icons.user}>
        {cargandoListas ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-500 text-sm">
            <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Cargando técnicos...
          </div>
        ) : (
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.user}</span>
            <select
              value={idTecnico}
              onChange={e => setIdTecnico(e.target.value)}
              className={selectBase}
              required
            >
              <option value="">— Selecciona un técnico —</option>
              {listaTecnicos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
        )}
        {tecnicoSeleccionado && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
              {tecnicoSeleccionado.nombre.charAt(0)}
            </div>
            <span className="text-xs text-indigo-300">{tecnicoSeleccionado.nombre} asignado</span>
          </div>
        )}
      </Field>

      {/* Equipos — checkboxes visuales en lugar del select múltiple nativo */}
      <Field
        label="Equipos de trabajo"
        icon={Icons.tools}
        hint={listaEquipos.length === 0 && !cargandoListas ? "No hay equipos disponibles en este momento." : undefined}
      >
        {cargandoListas ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-500 text-sm">
            <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Cargando equipos...
          </div>
        ) : listaEquipos.length > 0 ? (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 rounded-xl scrollbar-thin">
            {listaEquipos.map(eq => {
              const isSelected = equiposSeleccionados.includes(String(eq.id)) || equiposSeleccionados.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => toggleEquipo(eq.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-left border transition-all duration-150
                    ${isSelected
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200'
                      : 'bg-gray-900/50 border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    }`}
                >
                  {/* Checkbox visual */}
                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'border-gray-600 bg-gray-800'
                  }`}>
                    {isSelected && Icons.check}
                  </span>
                  <span className="flex-1 font-medium">{eq.nombre}</span>
                  <span className="text-xs text-gray-600">{eq.marca}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Contador de seleccionados */}
        {equiposSeleccionados.length > 0 && (
          <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/30 inline-flex items-center justify-center text-[9px] font-bold">
              {equiposSeleccionados.length}
            </span>
            equipo{equiposSeleccionados.length !== 1 ? 's' : ''} seleccionado{equiposSeleccionados.length !== 1 ? 's' : ''}
          </p>
        )}
      </Field>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl">
          <span className="text-rose-400 shrink-0 mt-0.5">{Icons.warn}</span>
          <p className="text-rose-300 text-sm leading-snug">{error}</p>
        </div>
      )}

      {/* Botón submit */}
      <button
        type="submit"
        disabled={cargando}
        className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl text-sm font-bold text-white
          bg-linear-to-r from-indigo-600 to-purple-600
          hover:from-indigo-500 hover:to-purple-500
          shadow-lg shadow-indigo-950/40
          hover:-translate-y-0.5 active:scale-95
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {cargando ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            {Icons.save}
            {ordenExistente ? "Actualizar Orden" : "Crear Orden"}
          </>
        )}
      </button>
    </form>
  );
};

export default CrearOrdenes;