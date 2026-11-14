import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";

// Minimal toast notification system: ToastProvider renders the stack,
// pages call useToast().success("...") / error / info.

const ToastContext = createContext(null);
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback((kind, message) => {
    const id = nextId++;
    setToasts((list) => [...list, { id, kind, message }]);
    timers.current[id] = setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  // Stable identity so consumers that depend on the context object
  // in effect deps do not refetch on every toast.
  const value = useMemo(() => ({
    success: (message) => push("success", message),
    error: (message) => push("error", message),
    info: (message) => push("info", message),
  }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            className={`toast toast-${toast.kind}`}
            onClick={() => dismiss(toast.id)}
          >
            <span className="toast-icon">
              <Icon name={toast.kind === "success" ? "check" : toast.kind === "error" ? "alert" : "info"} size={12} strokeWidth={2.6} />
            </span>
            <span>{toast.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
