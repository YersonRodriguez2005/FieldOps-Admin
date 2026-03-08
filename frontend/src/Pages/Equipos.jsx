import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerEquipos, eliminarEquipo } from '../api/Equipos';
import CrearEquipos from '../components/CrearEquipos';
import { useFieldOpsToast } from '../components/FieldOpsToast';

// ─── CSS de animaciones ───────────────────────────────────────────────────────
const EQUIPOS_CSS = `
  @keyframes fo-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fo-modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  @keyframes fo-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fo-row-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes fo-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes fo-pulse-ring {
    0%   { box-shadow: 0 0 0 0px  rgba(16,185,129,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0);    }
    100% { box-shadow: 0 0 0 0px  rgba(16,185,129,0);    }
  }
  .fo-brand-shimmer {
    background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fo-shimmer 4s linear infinite;
  }
  .fo-page-in    { animation: fo-fade-up    0.4s ease both; }
  .fo-modal-in   { animation: fo-modal-in   0.3s cubic-bezier(0.34,1.4,0.64,1) both; }
  .fo-overlay-in { animation: fo-overlay-in 0.2s ease both; }
  .fo-table-row  { animation: fo-row-in     0.3s ease both; }
  .fo-nav-active-pulse { animation: fo-pulse-ring 2.5s ease-out infinite; }
`;

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg>,
  users: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>,
  inventory: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" /><path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 10.5z" clipRule="evenodd" /></svg>,
  orders: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" /></svg>,
  logout: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25zM19 10a.75.75 0 00-.75-.75H8.704l1.048-1.068a.75.75 0 10-1.064-1.057l-2.5 2.535a.75.75 0 000 1.058l2.5 2.535a.75.75 0 101.064-1.057L8.704 10.75H18.25A.75.75 0 0019 10z" clipRule="evenodd" /></svg>,
  profile: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>,
  plus: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>,
  edit: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>,
  trash: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>,
  close: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>,
  warn: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
  emptyBox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  lock: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>,
};

// ─── Paleta de estado de equipo ───────────────────────────────────────────────
const ESTADO_STYLES = {
  'Disponible': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'En uso': 'bg-sky-500/15     text-sky-400     border-sky-500/25',
  'Mantenimiento': 'bg-amber-500/15   text-amber-400   border-amber-500/25',
  'Dañado': 'bg-rose-500/15    text-rose-400    border-rose-500/25',
};

const CONDICION_STYLES = {
  'Buena': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Regular': 'bg-amber-500/15   text-amber-400   border-amber-500/25',
  'Mala': 'bg-rose-500/15    text-rose-400    border-rose-500/25',
};

// ─── Modal de confirmación ────────────────────────────────────────────────────
const ConfirmModal = ({ nombre, onConfirm, onCancel }) => (
  <div className="fo-overlay-in fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="fo-modal-in bg-gray-800 border border-rose-500/30 rounded-2xl shadow-2xl shadow-rose-950/40 w-full max-w-sm p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-rose-400 shrink-0">{Icons.warn}</span>
        <div>
          <h3 className="text-white font-bold text-lg">¿Eliminar equipo?</h3>
          <p className="text-gray-400 text-sm mt-1">
            Estás a punto de eliminar <span className="text-white font-semibold">{nombre}</span> del inventario.
            Esta acción no se puede deshacer.
          </p>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-150 active:scale-95">
          Cancelar
        </button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-950/40 transition-all duration-150 active:scale-95 hover:-translate-y-0.5">
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
);

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/usuarios', label: 'Usuarios', icon: Icons.users },
  { to: '/equipos', label: 'Inventario', icon: Icons.inventory, active: true },
  { to: '/ordenes', label: 'Órdenes', icon: Icons.orders },
];

// ─── Componente principal ─────────────────────────────────────────────────────
const Equipos = () => {
  const toast = useFieldOpsToast();
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipoEditar, setEquipoEditar] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const esAdmin = localStorage.getItem('ocupacion')?.trim().toLowerCase() === 'administrador';

  // Inyectar CSS
  useEffect(() => {
    const id = 'fieldops-equipos-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = EQUIPOS_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchEquipos = async () => {
    try {
      const data = await obtenerEquipos();
      setEquipos(data);
    } catch {
      toast.error('No se pudo cargar el inventario', { title: 'Error de carga' });
    } finally {
      setCargando(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchEquipos(); }, []);

  // ── Modal CRUD ──
  const handleAbrirModalCrear = () => {
    if (!esAdmin) {
      toast.warning('Solo los administradores pueden registrar equipos.', { title: 'Acceso denegado' });
      return;
    }
    setEquipoEditar(null);
    setIsModalOpen(true);
  };

  const handleAbrirModalEditar = (equipo) => {
    if (!esAdmin) {
      toast.warning('Solo los administradores pueden editar equipos.', { title: 'Acceso denegado' });
      return;
    }
    setEquipoEditar(equipo);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setEquipoEditar(null);
  };

  const handleOperacionExitosa = () => {
    handleCerrarModal();
    fetchEquipos();
    toast.success(
      equipoEditar ? 'Los datos del equipo fueron actualizados.' : 'El equipo fue registrado en el inventario.',
      { title: equipoEditar ? 'Equipo actualizado' : 'Equipo registrado' }
    );
  };

  // ── Eliminación ──
  const handleSolicitarEliminar = (equipo) => {
    if (!esAdmin) {
      toast.warning('Solo los administradores pueden eliminar equipos.', { title: 'Acceso denegado' });
      return;
    }
    setConfirmData({ id: equipo.id, nombre: equipo.nombre });
  };

  const handleConfirmarEliminar = async () => {
    const { id, nombre } = confirmData;
    setConfirmData(null);
    try {
      await eliminarEquipo(id);
      setEquipos(prev => prev.filter(e => e.id !== id));
      toast.success(`${nombre} fue eliminado del inventario.`, { title: 'Equipo eliminado' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar el equipo', { title: 'No se pudo eliminar' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('ocupacion');
    toast.info('Sesión cerrada. ¡Hasta pronto!');
    setTimeout(() => navigate('/'), 700);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">

      {/* ── CONFIRM MODAL ── */}
      {confirmData && (
        <ConfirmModal
          nombre={confirmData.nombre}
          onConfirm={handleConfirmarEliminar}
          onCancel={() => setConfirmData(null)}
        />
      )}

      {/* ── CRUD MODAL ── */}
      {isModalOpen && (
        <div onClick={handleCerrarModal} className="fo-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
          <div onClick={e => e.stopPropagation()} className="fo-modal-in relative bg-gray-800/95 backdrop-blur-md border border-gray-700/70 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Línea de acento */}
            <div className={`sticky top-0 left-0 right-0 h-0.5 rounded-t-2xl z-10 ${equipoEditar ? 'bg-linear-to-r from-amber-500 to-orange-500' : 'bg-linear-to-r from-emerald-500 to-teal-500'}`} />

            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${equipoEditar ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    {equipoEditar ? Icons.edit : Icons.plus}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {equipoEditar ? 'Editar Equipo' : 'Nuevo Equipo'}
                  </h2>
                </div>
                <button onClick={handleCerrarModal} className="text-gray-500 hover:text-gray-200 transition-colors hover:bg-gray-700/60 rounded-lg p-1">
                  {Icons.close}
                </button>
              </div>

              <CrearEquipos equipoExistente={equipoEditar} onSuccess={handleOperacionExitosa} />
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 w-full bg-gray-800/90 backdrop-blur-md border-b border-gray-700/60 px-6 py-3.5 flex justify-between items-center shadow-lg shadow-black/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/50">
            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.315-.6a35.504 35.504 0 013.408-2.116.75.75 0 01.686 1.33 38.84 38.84 0 00-2.467 1.532A32.902 32.902 0 019.748 13.2a32.904 32.904 0 01-7.748-5.142.75.75 0 01-.253-1.285 41.059 41.059 0 018.198-5.424z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="fo-brand-shimmer text-2xl font-extrabold tracking-tight">FieldOps</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-400 text-sm">
            Hola, <span className="text-gray-200 font-semibold">{localStorage.getItem('nombre') || 'Usuario'}</span>
          </span>
          <a href="/perfil" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-amber-600/50 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 hover:border-amber-500 transition-all duration-200 hover:scale-105 active:scale-95">
            {Icons.profile}<span>Perfil</span>
          </a>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-rose-600/50 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 hover:border-rose-500 transition-all duration-200 hover:scale-105 active:scale-95">
            {Icons.logout}<span>Salir</span>
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-1">

        {/* ── SIDEBAR ── */}
        <aside className="w-60 bg-gray-800/70 border-r border-gray-700/50 flex flex-col p-5 sticky top-15.25 h-[calc(100vh-61px)] overflow-y-auto backdrop-blur-sm">
          <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest pb-3 border-b border-gray-700/50 mb-3">Navegación</p>
          <nav className="space-y-1.5">
            {navLinks.map(({ to, label, icon, active }) => (
              <Link key={to} to={to} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${active ? 'fo-nav-active-pulse bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/30' : 'text-gray-400 hover:bg-gray-700/60 hover:text-white border border-transparent'}`}>
                <span className={active ? 'text-emerald-400' : 'text-gray-500'}>{icon}</span>
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-5 border-t border-gray-700/40">
            <div className="text-[10px] text-gray-600 text-center">FieldOps v1.0 — Panel de control</div>
          </div>
        </aside>

        {/* ── CONTENIDO ── */}
        <main className="fo-page-in flex-1 p-8 xl:p-12 bg-gray-950/20">

          {/* Cabecera */}
          <div className="mb-8 flex justify-between items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-8 rounded-full bg-linear-to-b from-emerald-400 to-teal-500" />
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Inventario</h1>
              </div>
              <p className="text-gray-500 text-sm ml-4">Administra las herramientas y equipos de la empresa.</p>
            </div>
            {esAdmin && (
              <button onClick={handleAbrirModalCrear} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                {Icons.plus} Nuevo Equipo
              </button>
            )}
          </div>

          {/* Tabla */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700/60 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold">Marca</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado</th>
                  <th className="px-6 py-4 font-semibold text-center">Condición</th>
                  <th className="px-6 py-4 font-semibold text-center">Mantenimiento</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/40">
                {cargando ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Cargando inventario...</span>
                      </div>
                    </td>
                  </tr>
                ) : equipos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-600">
                        {Icons.emptyBox}
                        <p className="text-sm font-medium">No hay equipos en el inventario</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  equipos.map((equipo, i) => (
                    <tr key={equipo.id} className="fo-table-row hover:bg-gray-700/25 transition-colors duration-150" style={{ animationDelay: `${i * 0.04}s` }}>
                      <td className="px-6 py-4 text-gray-500 text-sm font-mono">#{equipo.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">{equipo.nombre}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{equipo.marca}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${ESTADO_STYLES[equipo.estado] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>
                          {equipo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${CONDICION_STYLES[equipo.condicion] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>
                          {equipo.condicion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-sm whitespace-nowrap">{equipo.fecha_mantto ?? '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleAbrirModalEditar(equipo)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 border border-amber-500/20 bg-amber-950/20 hover:bg-amber-950/50 hover:border-amber-500/50 hover:text-amber-300 transition-all duration-150 active:scale-95">
                            {Icons.edit} Editar
                          </button>
                          {esAdmin && (
                            <button onClick={() => handleSolicitarEliminar(equipo)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-950/20 hover:bg-rose-950/50 hover:border-rose-500/50 hover:text-rose-300 transition-all duration-150 active:scale-95">
                              {Icons.trash} Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!cargando && equipos.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-700/40 bg-gray-900/20">
                <span className="text-xs text-gray-600">
                  {equipos.length} equipo{equipos.length !== 1 ? 's' : ''} registrado{equipos.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Equipos;