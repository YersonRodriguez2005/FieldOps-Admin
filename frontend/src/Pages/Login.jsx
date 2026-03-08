import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/Auth';
import { useFieldOpsToast } from '../components/FieldOpsToast';

// ─── CSS de animaciones ───────────────────────────────────────────────────────
const LOGIN_CSS = `
  @keyframes fo-login-fade {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes fo-login-bg {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes fo-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes fo-spin-slow {
    to { transform: rotate(360deg); }
  }
  .fo-login-card {
    animation: fo-login-fade 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  }
  .fo-login-bg {
    background: radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 90%, rgba(16,185,129,0.04) 0%, transparent 60%),
                #111827;
  }
  .fo-brand-shimmer {
    background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fo-shimmer 4s linear infinite;
  }
  .fo-input-focus:focus {
    box-shadow: 0 0 0 3px rgba(56,189,248,0.15), 0 0 0 1px rgba(56,189,248,0.4);
  }
  .fo-btn-loading {
    animation: fo-spin-slow 0.8s linear infinite;
  }
`;

const Login = () => {
  const toast = useFieldOpsToast();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

  useEffect(() => {
    const id = 'fieldops-login-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = LOGIN_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const data = await login(correo, contrasena);
      localStorage.setItem('token', data.token);
      localStorage.setItem('nombre', data.nombre);
      localStorage.setItem('ocupacion', data.ocupacion);
      toast.success('Bienvenido de nuevo', { title: `Hola, ${data.nombre}` });
      setTimeout(() => navigate('/dashboard'), 600);
    } catch {
      toast.error('Verifica tu correo y contraseña.', { title: 'Credenciales inválidas' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fo-login-bg flex flex-col items-center justify-center w-full min-h-screen p-4">

      {/* Decoradores de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Tarjeta */}
      <div className="fo-login-card relative w-full max-w-md">

        {/* Borde brillante superior */}
        <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-sky-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative bg-gray-800/90 backdrop-blur-md border border-gray-700/60 shadow-2xl shadow-black/50 rounded-2xl p-8 space-y-7">

          {/* Logo + título */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 shadow-lg shadow-indigo-950/50 mb-1">
              <img className='w-full h-full object-cover' src="/Logo.jpg" alt="Logo FieldOps" />
            </div>
            <h2 className="fo-brand-shimmer text-3xl font-extrabold tracking-tight">
              FieldOps
            </h2>
            <p className="text-gray-500 text-sm">Panel de administración · Ingresa tus credenciales</p>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-700/50" />

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="fo-input-focus w-full pl-10 pr-4 py-3 text-sm text-white bg-gray-900/70 border border-gray-700 rounded-xl placeholder-gray-600 outline-none transition-all duration-200 hover:border-gray-600"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="fo-input-focus w-full pl-10 pr-11 py-3 text-sm text-white bg-gray-900/70 border border-gray-700 rounded-xl placeholder-gray-600 outline-none transition-all duration-200 hover:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {mostrarPass ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-bold text-white rounded-xl
                bg-linear-to-r from-sky-600 to-indigo-600
                hover:from-sky-500 hover:to-indigo-500
                shadow-lg shadow-indigo-950/50
                hover:shadow-indigo-500/20
                hover:-translate-y-0.5
                active:scale-95
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {cargando ? (
                <>
                  <svg className="fo-btn-loading w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" d="M12 3a9 9 0 109 9" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25zM19 10a.75.75 0 00-.75-.75H8.704l1.048-1.068a.75.75 0 10-1.064-1.057l-2.5 2.535a.75.75 0 000 1.058l2.5 2.535a.75.75 0 101.064-1.057L8.704 10.75H18.25A.75.75 0 0019 10z" clipRule="evenodd" />
                  </svg>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Footer de tarjeta */}
          <p className="text-center text-[11px] text-gray-600 pt-1">
            FieldOps Admin · Acceso restringido al personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;