import React from "react";
import { InvoiceStatus } from "@/types/invoice";
import { Clock, CheckCircle2, XCircle, Copy } from "lucide-react";

interface StatusBadgeProps {
  status: InvoiceStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs font-medium gap-1"
      : "px-2.5 py-1 text-xs font-semibold tracking-wide gap-1.5";

  switch (status) {
    case "PROCESSING":
      return (
        <span
          className={`inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-blue-400 shrink-0" />
          Processing
        </span>
      );
    case "NEEDS_REVIEW":
      return (
        <span
          className={`inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 ${sizeClasses}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Needs Review
        </span>
      );
    case "APPROVED":
      return (
        <span
          className={`inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          Approved
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={`inline-flex items-center rounded-full border border-rose-500/25 bg-rose-500/10 text-rose-300 ${sizeClasses}`}
        >
          <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
          Rejected
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}

export function DuplicateBadge({
  onCompareClick,
}: {
  onCompareClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCompareClick}
      title="Click to compare duplicate"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border border-orange-500/30 bg-orange-950/40 text-orange-300 hover:bg-orange-900/50 transition-colors ${
        onCompareClick ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <Copy className="w-3 h-3 text-orange-400" />
      Duplicate Flag
    </button>
  );
}
