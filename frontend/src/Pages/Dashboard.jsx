import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldOpsToast } from '../components/FieldOpsToast';

// ─── Iconos SVG inline ────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
      <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 10.5z" clipRule="evenodd" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-1.068a.75.75 0 10-1.064-1.057l-2.5 2.535a.75.75 0 000 1.058l2.5 2.535a.75.75 0 101.064-1.057L8.704 10.75H18.25A.75.75 0 0019 10z" clipRule="evenodd" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
  ),
  // Métricas
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ─── Estilos de animación CSS ─────────────────────────────────────────────────
const DASHBOARD_CSS = `
  @keyframes fo-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fo-pulse-ring {
    0%   { box-shadow: 0 0 0 0px rgba(16,185,129,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0);   }
    100% { box-shadow: 0 0 0 0px rgba(16,185,129,0);    }
  }
  @keyframes fo-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .fo-card { animation: fo-fade-up 0.45s ease both; }
  .fo-card:nth-child(1) { animation-delay: 0.05s; }
  .fo-card:nth-child(2) { animation-delay: 0.15s; }
  .fo-card:nth-child(3) { animation-delay: 0.25s; }
  .fo-card:nth-child(4) { animation-delay: 0.35s; }
  .fo-brand {
    background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fo-shimmer 4s linear infinite;
  }
  .fo-nav-active { animation: fo-pulse-ring 2.5s ease-out infinite; }
  .fo-header-in {
    animation: fo-fade-up 0.3s ease both;
  }
`;

// ─── Componente de métrica individual ────────────────────────────────────────
const MetricCard = ({ icon, colorClass, borderClass, bgClass, shadowClass, label, sublabel, value, subvalue }) => (
  <div
    className={`
      fo-card relative group overflow-hidden
      p-7 rounded-2xl border-2 ${borderClass} ${bgClass}
      flex flex-col gap-4
      shadow-xl ${shadowClass}
      hover:scale-[1.025] hover:-translate-y-1
      transition-all duration-300 ease-out
      cursor-default
    `}
  >
    {/* Brillo de fondo al hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ${bgClass} blur-xl scale-110`} />

    {/* Icono + etiqueta */}
    <div className="flex items-center gap-3 relative z-10">
      <span className={`${colorClass} opacity-80 group-hover:opacity-100 transition-opacity`}>
        {icon}
      </span>
      <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{label}</span>
    </div>

    {/* Número principal */}
    <div className="relative z-10">
      <span className={`text-5xl font-black ${colorClass} tabular-nums leading-none`}>
        {value ?? '—'}
      </span>
    </div>

    {/* Sublabel + subvalor */}
    {sublabel && (
      <div className="relative z-10 flex items-center gap-2 pt-1 border-t border-white/5">
        <span className="text-gray-500 text-sm">{sublabel}</span>
        <span className={`text-xl font-bold text-white tabular-nums`}>
          {subvalue ?? '—'}
        </span>
      </div>
    )}
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const DashboardMetricas = () => {
  const toast = useFieldOpsToast();
  const navigate = useNavigate();

  const [metricas, setMetricas] = useState({
    totalOrdenes: 0,
    ordenesCompletadas: 0,
    tecnicosActivos: 0,
    equiposMantenimiento: 0,
    ordenesPendientes: 0,
  });

  const [cargando, setCargando] = useState(true);

  // Inyectar CSS de animaciones
  useEffect(() => {
    const id = 'fieldops-dashboard-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = DASHBOARD_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const obtenerDatosDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('http://localhost:3000/dashboard/metricas', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          setMetricas(datos);
          toast.success('Métricas actualizadas', { title: 'Dashboard' });
        } else {
          toast.error('No se pudieron cargar las métricas', { title: 'Error del servidor' });
        }
      } catch (error) {
        console.error('Error cargando métricas:', error);
        toast.warning('Revisando conexión con el servidor...', { title: 'Sin conexión' });
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Sesión cerrada. ¡Hasta pronto!');
    setTimeout(() => navigate('/'), 800);
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Icons.dashboard, active: true },
    { href: '/usuarios',  label: 'Usuarios',   icon: Icons.users    },
    { href: '/equipos',   label: 'Inventario',  icon: Icons.inventory },
    { href: '/ordenes',   label: 'Órdenes',     icon: Icons.orders   },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">

      {/* ── HEADER ── */}
      <header className="fo-header-in sticky top-0 z-20 w-full bg-gray-800/90 backdrop-blur-md border-b border-gray-700/60 px-6 py-3.5 flex justify-between items-center shadow-lg shadow-black/30">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/50">
            <img className='w-full h-full object-cover' src="/Logo.jpg" alt="Logo FieldOps" />
          </div>
          <h2 className="fo-brand text-2xl font-extrabold tracking-tight">FieldOps</h2>
        </div>

        {/* Controles derecha */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-400 text-sm">
            Hola, <span className="text-gray-200 font-semibold">{localStorage.getItem('nombre') || 'Usuario'}</span>
          </span>

          <a
            href="/perfil"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
              border border-amber-600/50 bg-amber-950/30 text-amber-300
              hover:bg-amber-950/60 hover:border-amber-500 hover:text-amber-200
              transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
          >
            {Icons.profile}
            <span>Perfil</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
              border border-rose-600/50 bg-rose-950/30 text-rose-300
              hover:bg-rose-950/60 hover:border-rose-500 hover:text-rose-200
              transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
          >
            {Icons.logout}
            <span>Salir</span>
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-1">

        {/* ── SIDEBAR ── */}
        <aside className="w-60 bg-gray-800/70 border-r border-gray-700/50 flex flex-col p-5 sticky top-15.25 h-[calc(100vh-61px)] overflow-y-auto backdrop-blur-sm">
          <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest pb-3 border-b border-gray-700/50 mb-3">
            Navegación
          </p>
          <nav className="space-y-1.5">
            {navLinks.map(({ href, label, icon, active }) => (
              <a
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 active:scale-95
                  ${active
                    ? 'fo-nav-active bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/30'
                    : 'text-gray-400 hover:bg-gray-700/60 hover:text-white border border-transparent'
                  }
                `}
              >
                <span className={active ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}>
                  {icon}
                </span>
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </a>
            ))}
          </nav>

          {/* Decorador inferior */}
          <div className="mt-auto pt-5 border-t border-gray-700/40">
            <div className="text-[10px] text-gray-600 text-center">
              FieldOps v1.0 — Panel de control
            </div>
          </div>
        </aside>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="flex-1 p-8 xl:p-12 bg-gray-950/20 min-h-full">

          {/* Cabecera de sección */}
          <div className="mb-10" style={{ animation: 'fo-fade-up 0.3s ease both' }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full bg-linear-to-b from-sky-400 to-indigo-500" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
              <span className="ml-1 text-gray-500 font-light text-3xl">/</span>
              <span className="text-3xl font-light text-gray-400">Métricas</span>
            </div>
            <p className="text-gray-500 mt-1 ml-4 text-sm">
              Resumen de actividad actual de la plataforma
              {cargando && <span className="ml-2 inline-block w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin align-middle" />}
            </p>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7">

            <MetricCard
              icon={Icons.bolt}
              colorClass="text-sky-400"
              borderClass="border-sky-500/40"
              bgClass="bg-sky-950/25"
              shadowClass="shadow-sky-950/40"
              label="Órdenes de trabajo"
              sublabel="Completadas"
              value={metricas.totalOrdenes}
              subvalue={metricas.ordenesCompletadas}
            />

            <MetricCard
              icon={Icons.users}
              colorClass="text-indigo-400"
              borderClass="border-indigo-500/40"
              bgClass="bg-indigo-950/25"
              shadowClass="shadow-indigo-950/40"
              label="Técnicos activos"
              value={metricas.tecnicosActivos}
            />

            <MetricCard
              icon={Icons.wrench}
              colorClass="text-amber-400"
              borderClass="border-amber-500/40"
              bgClass="bg-amber-950/25"
              shadowClass="shadow-amber-950/40"
              label="Equipos en mantenimiento"
              value={metricas.equiposMantenimiento}
            />

            <MetricCard
              icon={Icons.clock}
              colorClass="text-rose-400"
              borderClass="border-rose-500/40"
              bgClass="bg-rose-950/25"
              shadowClass="shadow-rose-950/40"
              label="Órdenes de trabajo"
              sublabel="Pendientes"
              value={metricas.totalOrdenes}
              subvalue={metricas.ordenesPendientes}
            />

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMetricas;