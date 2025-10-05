import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms
};

type ToastContextType = {
  notify: (t: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const typeDot: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timersRef.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete timersRef.current[id];
    }
  }, []);

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = toast.duration ?? 3500;
    setToasts(prev => [...prev, { ...toast, id, duration }]);
    timersRef.current[id] = window.setTimeout(() => remove(id), duration);
  }, [remove]);

  const value = useMemo(() => ({ notify, remove }), [notify, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container fixo canto superior direito */}
      <div className="fixed top-4 right-4 z-[1000] space-y-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-sm rounded-xl border shadow-lg ${typeStyles[t.type]}`}
            role="status"
            aria-live="polite"
          >
            <div className="px-4 py-3 flex items-start">
              <span className={`inline-block w-2.5 h-2.5 rounded-full mr-3 mt-1 ${typeDot[t.type]}`} aria-hidden="true" />
              <div className="text-sm font-medium break-words pr-6">{t.message}</div>
              <button
                aria-label="Fechar notificação"
                className="ml-2 text-sm opacity-60 hover:opacity-100"
                onClick={() => remove(t.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
