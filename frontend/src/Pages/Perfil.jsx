import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerUsuarios } from '../api/Usuarios';
import { useFieldOpsToast } from '../components/FieldOpsToast';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const PERFIL_CSS = `
  @keyframes fo-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
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
  @keyframes fo-avatar-ring {
    0%   { box-shadow: 0 0 0 0px  rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0);   }
    100% { box-shadow: 0 0 0 0px  rgba(99,102,241,0);   }
  }
  .fo-brand-shimmer {
    background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fo-shimmer 4s linear infinite;
  }
  .fo-page-in   { animation: fo-fade-up 0.4s ease both; }
  .fo-card-in   { animation: fo-fade-up 0.45s 0.1s ease both; }
  .fo-detail-in { animation: fo-fade-up 0.4s ease both; }
  .fo-detail-in:nth-child(1) { animation-delay: 0.15s; }
  .fo-detail-in:nth-child(2) { animation-delay: 0.25s; }
  .fo-detail-in:nth-child(3) { animation-delay: 0.35s; }
  .fo-nav-active-pulse { animation: fo-pulse-ring 2.5s ease-out infinite; }
  .fo-avatar-pulse     { animation: fo-avatar-ring 3s ease-out infinite; }
`;

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg>,
  users: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>,
  inventory: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" /><path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 10.5z" clipRule="evenodd" /></svg>,
  orders: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" /></svg>,
  profile: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>,
  logout: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25zM19 10a.75.75 0 00-.75-.75H8.704l1.048-1.068a.75.75 0 10-1.064-1.057l-2.5 2.535a.75.75 0 000 1.058l2.5 2.535a.75.75 0 101.064-1.057L8.704 10.75H18.25A.75.75 0 0019 10z" clipRule="evenodd" /></svg>,
  mail: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg>,
  id: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1 6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm4 1.5a2 2 0 114 0 2 2 0 01-4 0zm2 3c-1.012 0-1.67.238-2.08.487C4.super 11.216 4.75 11.813 4.75 12h6.5c0-.187-.179-.784-.671-1.013C10.17 10.739 9.512 10.5 8.5 10.5zM13.25 9a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm0 3a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" /></svg>,
  badge: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>,
  error: <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
};

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { to: '/usuarios', label: 'Usuarios', icon: Icons.users },
  { to: '/equipos', label: 'Inventario', icon: Icons.inventory },
  { to: '/ordenes', label: 'Órdenes', icon: Icons.orders },
  { to: '/perfil', label: 'Mi Perfil', icon: Icons.profile, active: true },
];

// ─── Tarjeta de detalle ───────────────────────────────────────────────────────
const DetailCard = ({ icon, label, value, mono = false, accent = 'sky' }) => (
  <div className="fo-detail-in group flex items-center gap-4 p-5 bg-gray-900/40 border border-gray-700/50 rounded-xl hover:border-gray-600/60 transition-all duration-200">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${accent}-500/15 text-${accent}-400 border border-${accent}-500/20 group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-base text-gray-100 font-medium truncate ${mono ? 'font-mono text-sm text-gray-400' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Perfil = () => {
  const toast = useFieldOpsToast();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  // Inyectar CSS
  useEffect(() => {
    const id = 'fieldops-perfil-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = PERFIL_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const usuarios = await obtenerUsuarios();
        const usuarioActual = usuarios.find(u => u.id === payload.id);
        if (!usuarioActual) throw new Error('Usuario no encontrado');
        setPerfil(usuarioActual);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar tu perfil. Intenta nuevamente.");
        toast.error("No se pudo cargar tu perfil.", { title: "Error de perfil" });
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Sesión cerrada. ¡Hasta pronto!");
    setTimeout(() => navigate('/'), 700);
  };

  const inicial = perfil?.nombre?.charAt(0)?.toUpperCase() ?? '?';
  const esAdmin = perfil?.ocupacion?.toLowerCase() === 'administrador';

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 w-full bg-gray-800/90 backdrop-blur-md border-b border-gray-700/60 px-6 py-3.5 flex justify-between items-center shadow-lg shadow-black/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/50">
            <img className='w-full h-full object-cover' src="/Logo.jpg" alt="Logo FieldOps" />
          </div>
          <h2 className="fo-brand-shimmer text-2xl font-extrabold tracking-tight">FieldOps</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-400 text-sm">
            Hola, <span className="text-gray-200 font-semibold">{localStorage.getItem('nombre') || 'Usuario'}</span>
          </span>
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
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full bg-linear-to-b from-violet-400 to-purple-500" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Mi Perfil</h1>
            </div>
            <p className="text-gray-500 text-sm ml-4">Información de tu cuenta y credenciales de acceso.</p>
          </div>

          {/* Estado: error */}
          {error && (
            <div className="flex items-center gap-3 p-5 bg-rose-950/30 border border-rose-500/30 rounded-2xl max-w-lg">
              <span className="text-rose-400 shrink-0">{Icons.error}</span>
              <div>
                <p className="text-rose-300 font-semibold text-sm">Error al cargar perfil</p>
                <p className="text-rose-400/70 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Estado: cargando */}
          {!error && cargando && (
            <div className="flex items-center gap-4 p-6 bg-gray-800/40 border border-gray-700/40 rounded-2xl max-w-lg">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <p className="text-gray-400 text-sm">Cargando tu perfil...</p>
            </div>
          )}

          {/* Estado: perfil cargado */}
          {!error && !cargando && perfil && (
            <div className="fo-card-in max-w-2xl">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">

                {/* Banner superior con avatar */}
                <div className="relative bg-linear-to-r from-gray-900 via-indigo-950/30 to-gray-900 px-8 py-10 border-b border-gray-700/50">
                  {/* Decorador de fondo */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(99,102,241,0.3) 0%, transparent 60%)'
                  }} />

                  <div className="relative flex items-center gap-6">
                    {/* Avatar */}
                    <div className={`fo-avatar-pulse w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-xl shrink-0
                      ${esAdmin
                        ? 'bg-linear-to-br from-rose-500 to-amber-600 shadow-amber-950/40'
                        : 'bg-linear-to-br from-indigo-500 to-purple-600 shadow-indigo-950/40'
                      }`}
                    >
                      {inicial}
                    </div>

                    {/* Nombre y rol */}
                    <div>
                      <h2 className="text-2xl font-extrabold text-white mb-2">{perfil.nombre}</h2>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${esAdmin
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                        {Icons.badge}
                        {perfil.ocupacion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalles */}
                <div className="p-6 space-y-3">
                  <DetailCard
                    icon={Icons.mail}
                    label="Correo electrónico"
                    value={perfil.correo}
                    accent="sky"
                  />
                  <DetailCard
                    icon={Icons.badge}
                    label="Rol en el sistema"
                    value={perfil.ocupacion}
                    accent={esAdmin ? 'rose' : 'indigo'}
                  />
                  <DetailCard
                    icon={Icons.id}
                    label="ID de sistema"
                    value={`#${perfil.id}`}
                    mono
                    accent="gray"
                  />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700/40 bg-gray-900/20 flex items-center justify-between">
                  <span className="text-xs text-gray-600">Sesión activa · FieldOps v1.0</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-rose-600/40 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-all duration-150 active:scale-95"
                  >
                    {Icons.logout} Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Perfil;