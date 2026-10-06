import React from "react";
import { InvoiceStatus } from "@/types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] gap-1.5"
      : "px-2.5 py-1 text-xs gap-1.5 font-medium";

  switch (status) {
    case "PROCESSING":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          Processing
        </span>
      );
    case "NEEDS_REVIEW":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-900 border border-amber-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          Needs Review
        </span>
      );
    case "APPROVED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          Approved
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-900 border border-rose-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          Rejected
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}

export function DuplicateBadge({
  onCompareClick,
  referenceId,
}: {
  onCompareClick?: () => void;
  referenceId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onCompareClick}
      title="Click to view side-by-side comparison"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-800 border border-orange-200/90 hover:bg-orange-100 hover:border-orange-300 transition-all ${
        onCompareClick ? "cursor-pointer" : ""
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
      <span>Duplicate</span>
      {referenceId && (
        <span className="font-mono text-[10px] text-orange-600 ml-0.5 opacity-80">
          ({referenceId})
        </span>
      )}
    </button>
  );
}
