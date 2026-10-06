import React, { useEffect } from "react";
import { X } from "lucide-react";

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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
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
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const borderStyles = {
    success: "border-zinc-200 bg-white text-zinc-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-zinc-200 bg-white text-zinc-900",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg border shadow-md transition-all ${
        borderStyles[toast.type]
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold">{toast.message}</div>
        {toast.description && (
          <div className="text-[11px] text-zinc-500 mt-0.5">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-zinc-400 hover:text-zinc-600 p-0.5 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
