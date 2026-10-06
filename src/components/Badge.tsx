import React from "react";
import { InvoiceStatus } from "@/types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "PROCESSING":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
          Processing
        </span>
      );
    case "NEEDS_REVIEW":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          Needs Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-colors ${
        onCompareClick ? "cursor-pointer" : ""
      }`}
    >
      Duplicate
    </button>
  );
}
