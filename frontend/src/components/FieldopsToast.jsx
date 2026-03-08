import React, { createContext, useState, useCallback, useRef, useContext, useEffect, useMemo } from 'react';

// ─── Contexto global ──────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Iconos SVG inline (sin dependencias extra) ───────────────────────────────
const Icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  ),
};

// ─── Configuración visual por tipo ────────────────────────────────────────────
const TOAST_STYLES = {
  success: {
    border: 'border-emerald-500/60',
    bg: 'bg-emerald-950/80',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-500',
    title: 'text-emerald-300',
    glow: 'shadow-emerald-950/60',
  },
  error: {
    border: 'border-rose-500/60',
    bg: 'bg-rose-950/80',
    icon: 'text-rose-400',
    bar: 'bg-rose-500',
    title: 'text-rose-300',
    glow: 'shadow-rose-950/60',
  },
  warning: {
    border: 'border-amber-500/60',
    bg: 'bg-amber-950/80',
    icon: 'text-amber-400',
    bar: 'bg-amber-500',
    title: 'text-amber-300',
    glow: 'shadow-amber-950/60',
  },
  info: {
    border: 'border-sky-500/60',
    bg: 'bg-sky-950/80',
    icon: 'text-sky-400',
    bar: 'bg-sky-500',
    title: 'text-sky-300',
    glow: 'shadow-sky-950/60',
  },
};

// ─── Estilos de animación inyectados en <head> ────────────────────────────────
const ANIMATION_CSS = `
  @keyframes fieldops-slide-in {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }
  @keyframes fieldops-slide-out {
    from { transform: translateX(0);   opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
  }
  @keyframes fieldops-progress {
    from { width: 100%; }
    to   { width: 0%;   }
  }
  .fieldops-toast-enter {
    animation: fieldops-slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .fieldops-toast-exit {
    animation: fieldops-slide-out 0.28s ease-in forwards;
  }
`;

// ─── Componente individual Toast ──────────────────────────────────────────────
const Toast = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const duration = toast.duration ?? 4000;

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 280);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [handleClose, duration]);

  return (
    <div
      role="alert"
      className={`
        relative flex items-start gap-3 w-80 px-4 pt-4 pb-5
        rounded-xl border backdrop-blur-sm overflow-hidden
        shadow-xl ${style.glow} ${style.bg} ${style.border}
        ${exiting ? 'fieldops-toast-exit' : 'fieldops-toast-enter'}
      `}
    >
      {/* Icono */}
      <span className={`mt-0.5 shrink-0 ${style.icon}`}>
        {Icons[toast.type] || Icons.info}
      </span>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-bold leading-tight ${style.title}`}>
            {toast.title}
          </p>
        )}
        <p className="text-sm text-gray-200 leading-snug mt-0.5">
          {toast.message}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        className="shrink-0 text-gray-500 hover:text-gray-200 transition-colors mt-0.5"
        aria-label="Cerrar notificación"
      >
        {Icons.close}
      </button>

      {/* Barra de progreso */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 ${style.bar} rounded-full`}
        style={{ animation: `fieldops-progress ${duration}ms linear forwards` }}
      />
    </div>
  );
};

// ─── Provider (envuelve la app entera) ───────────────────────────────────────
export function FieldOpsToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  // Inyectar CSS de animaciones una sola vez
  useEffect(() => {
    const styleId = 'fieldops-toast-styles';
    if (!document.getElementById(styleId)) {
      const tag = document.createElement('style');
      tag.id = styleId;
      tag.textContent = ANIMATION_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration }) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Memorizamos el objeto toast para evitar re-renders innecesarios en la App
  const toast = useMemo(() => ({
    success: (message, opts = {}) => addToast({ type: 'success', message, ...opts }),
    error:   (message, opts = {}) => addToast({ type: 'error',   message, ...opts }),
    warning: (message, opts = {}) => addToast({ type: 'warning', message, ...opts }),
    info:    (message, opts = {}) => addToast({ type: 'info',    message, ...opts }),
    custom:  (opts)               => addToast(opts),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal de notificaciones — esquina inferior derecha (Corregido z-[9999]) */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 items-end"
      >
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFieldOpsToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useFieldOpsToast debe usarse dentro de <FieldOpsToastProvider>');
  return ctx;
}

export { ToastContext };