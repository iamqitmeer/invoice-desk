import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, XCircle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
    error: <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
    info: <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
  };

  const borderColors = {
    success: "border-emerald-500/30 bg-zinc-900/95 shadow-emerald-950/20",
    error: "border-rose-500/30 bg-zinc-900/95 shadow-rose-950/20",
    info: "border-blue-500/30 bg-zinc-900/95 shadow-blue-950/20",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200 ${
        borderColors[toast.type]
      }`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-zinc-100">{toast.message}</div>
        {toast.description && (
          <div className="text-[11px] text-zinc-400 mt-0.5">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
