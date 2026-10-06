import React from "react";
import { InvoicesStats } from "@/types/invoice";

interface StatsCardsProps {
  stats: InvoicesStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-lg border border-zinc-200 bg-white p-3.5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Pending Amount",
      value: `$${stats.totalPendingAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      detail: `${stats.processing + stats.needsReview} pending review`,
    },
    {
      label: "Needs Review",
      value: stats.needsReview.toString(),
      detail: "Requires decision",
    },
    {
      label: "Approved",
      value: stats.approved.toString(),
      detail: `${stats.rejected} rejected`,
    },
    {
      label: "Duplicates Flagged",
      value: stats.duplicateCount.toString(),
      detail: "Potential duplicate",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-zinc-200 bg-white p-3.5 shadow-xs"
        >
          <div className="text-xs font-medium text-zinc-500">{item.label}</div>
          <div className="text-xl font-semibold text-zinc-900 mt-1 tracking-tight">
            {item.value}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}
