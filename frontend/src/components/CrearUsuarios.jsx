import React, { useState } from "react";
import { crearUsuario, actualizarUsuario } from "../api/Usuarios";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Icons = {
  user:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>,
  mail:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg>,
  lock:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>,
  badge:   <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>,
  eye:     <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" /></svg>,
  eyeOff:  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" /><path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" /></svg>,
  save:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>,
  warn:    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
};

// ─── Input con ícono ──────────────────────────────────────────────────────────
const Field = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      <span className="text-gray-600">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);


// ─── Componente ───────────────────────────────────────────────────────────────
const CrearUsuarios = ({ usuarioExistente, onSuccess }) => {
  const [nombre,     setNombre]     = useState(usuarioExistente?.nombre    ?? "");
  const [correo,     setCorreo]     = useState(usuarioExistente?.correo    ?? "");
  const [contrasena, setContrasena] = useState("");
  const [ocupacion,  setOcupacion]  = useState(usuarioExistente?.ocupacion ?? "Técnico");
  const [error,      setError]      = useState("");
  const [cargando,   setCargando]   = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  const esAdmin = localStorage.getItem('ocupacion') === 'Administrador';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (usuarioExistente) {
        await actualizarUsuario(usuarioExistente.id, { nombre, correo, contrasena, ocupacion });
      } else {
        await crearUsuario({ nombre, correo, contrasena, ocupacion });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el usuario. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nombre */}
      <Field label="Nombre completo" icon={Icons.user}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.user}</span>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Carlos Ramírez"
            className="w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-gray-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
            required
          />
        </div>
      </Field>

      {/* Correo */}
      <Field label="Correo electrónico" icon={Icons.mail}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.mail}</span>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            placeholder="usuario@correo.com"
            className="w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-gray-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
            required
          />
        </div>
      </Field>

      {/* Contraseña */}
      <Field label={usuarioExistente ? "Nueva contraseña (opcional)" : "Contraseña"} icon={Icons.lock}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.lock}</span>
          <input
            type={showPass ? 'text' : 'password'}
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-gray-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
            required={!usuarioExistente}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPass ? Icons.eyeOff : Icons.eye}
          </button>
        </div>
        {usuarioExistente && (
          <p className="text-[11px] text-gray-600 mt-1">Deja vacío para mantener la contraseña actual.</p>
        )}
      </Field>

      {/* Ocupación */}
      <Field label="Ocupación / Rol" icon={Icons.badge}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{Icons.badge}</span>
          <select
            value={ocupacion}
            onChange={e => setOcupacion(e.target.value)}
            className="w-full bg-gray-900/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none transition-all duration-200 hover:border-gray-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 appearance-none"
          >
            <option value="Técnico">Técnico</option>
            <option value="Administrador">Administrador</option>
          </select>
          {/* Indicador de rol */}
          <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold pointer-events-none ${
            ocupacion === 'Administrador'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
          }`}>
            {ocupacion}
          </span>
        </div>
      </Field>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl">
          <span className="text-rose-400 shrink-0 mt-0.5">{Icons.warn}</span>
          <p className="text-rose-300 text-sm leading-snug">{error}</p>
        </div>
      )}

      {/* Botón submit */}
      {esAdmin && (
        <button
          type="submit"
          disabled={cargando}
          className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl text-sm font-bold text-white
            bg-linear-to-r from-sky-600 to-indigo-600
            hover:from-sky-500 hover:to-indigo-500
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
              {usuarioExistente ? "Actualizar Usuario" : "Crear Usuario"}
            </>
          )}
        </button>
      )}
    </form>
  );
};

export default CrearUsuarios;