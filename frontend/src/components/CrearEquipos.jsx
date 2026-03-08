import React, { useState } from "react";
import { crearEquipo, actualizarEquipo } from "../api/Equipos";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Icons = {
  tag:      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  brand:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" /></svg>,
  status:   <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>,
  cond:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>,
  calendar: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>,
  save:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>,
  warn:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  wrench:   <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 11-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 015.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 00-.025.627l1.398 1.398a.455.455 0 00.627-.025l2.691-2.692c.241-.241.647-.174.752.15.14.435.217.9.217 1.382zM4 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
};

// ─── Estilos semánticos de estado ─────────────────────────────────────────────
const ESTADO_OPTS = [
  { value: 'Disponible',    color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { value: 'Mantenimiento', color: 'text-amber-400   bg-amber-500/15   border-amber-500/30'   },
  { value: 'Asignado',      color: 'text-sky-400     bg-sky-500/15     border-sky-500/30'      },
];

const CONDICION_OPTS = ['Nuevo', 'Buena', 'Regular', 'Mala', 'Dañado'];

// ─── Campo genérico con ícono ─────────────────────────────────────────────────
const Field = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      <span className="text-gray-600">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const inputBase = `w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5
  text-sm text-white placeholder-gray-600 outline-none transition-all duration-200
  hover:border-gray-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20`;

// ─── Componente ───────────────────────────────────────────────────────────────
const CrearEquipos = ({ equipoExistente, onSuccess }) => {
  const [nombre,      setNombre]      = useState(equipoExistente?.nombre     ?? "");
  const [marca,       setMarca]       = useState(equipoExistente?.marca      ?? "");
  const [estado,      setEstado]      = useState(equipoExistente?.estado     ?? "Disponible");
  const [condicion,   setCondicion]   = useState(equipoExistente?.condicion  ?? "Nuevo");
  const [fecha_mantto, setFechaMantto] = useState(
    equipoExistente?.fecha_mantto ? equipoExistente.fecha_mantto.split('T')[0] : ""
  );
  const [error,    setError]    = useState("");
  const [cargando, setCargando] = useState(false);

  const esAdmin = localStorage.getItem('ocupacion')?.trim().toLowerCase() === 'administrador';

  // Color del badge de estado activo
  const estadoActivo = ESTADO_OPTS.find(o => o.value === estado);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (equipoExistente) {
        await actualizarEquipo(equipoExistente.id, { nombre, marca, estado, condicion, fecha_mantto });
      } else {
        await crearEquipo({ nombre, marca, estado, condicion, fecha_mantto });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el equipo. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nombre */}
      <Field label="Nombre del equipo" icon={Icons.tag}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.tag}</span>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Llave Inglesa"
            className={inputBase}
            required
          />
        </div>
      </Field>

      {/* Marca */}
      <Field label="Marca" icon={Icons.brand}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.brand}</span>
          <input
            type="text"
            value={marca}
            onChange={e => setMarca(e.target.value)}
            placeholder="Ej. Stanley"
            className={inputBase}
            required
          />
        </div>
      </Field>

      {/* Estado — selector visual con chips */}
      <Field label="Estado" icon={Icons.status}>
        <div className="flex gap-2 flex-wrap">
          {ESTADO_OPTS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEstado(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-95
                ${estado === opt.value
                  ? `${opt.color} shadow-sm scale-105`
                  : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
            >
              {opt.value}
            </button>
          ))}
        </div>
      </Field>

      {/* Condición — selector visual con chips */}
      <Field label="Condición" icon={Icons.cond}>
        <div className="flex gap-2 flex-wrap">
          {CONDICION_OPTS.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setCondicion(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-95
                ${condicion === opt
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 scale-105 shadow-sm'
                  : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Field>

      {/* Fecha de mantenimiento */}
      <Field label="Fecha de mantenimiento" icon={Icons.calendar}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.calendar}</span>
          <input
            type="date"
            value={fecha_mantto}
            onChange={e => setFechaMantto(e.target.value)}
            className={inputBase}
            required
          />
        </div>
      </Field>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl">
          <span className="text-rose-400 shrink-0 mt-0.5">{Icons.warn}</span>
          <p className="text-rose-300 text-sm leading-snug">{error}</p>
        </div>
      )}

      {/* Resumen antes de guardar */}
      {(nombre || marca) && (
        <div className="p-3 bg-gray-900/40 border border-gray-700/50 rounded-xl space-y-1">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-1.5">Vista previa</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">{nombre || '—'} · {marca || '—'}</span>
            {estadoActivo && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${estadoActivo.color}`}>
                {estado}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Botón submit */}
      {esAdmin && (
        <button
          type="submit"
          disabled={cargando}
          className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl text-sm font-bold text-white
            bg-linear-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            shadow-lg shadow-emerald-950/40
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
              {equipoExistente ? "Actualizar Equipo" : "Registrar Equipo"}
            </>
          )}
        </button>
      )}
    </form>
  );
};

export default CrearEquipos;