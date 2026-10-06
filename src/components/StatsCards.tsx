import React from "react";
import { InvoicesStats } from "@/types/invoice";

interface StatsCardsProps {
  stats: InvoicesStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-zinc-200/80 bg-white p-4 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Pending Invoices",
      value: `$${stats.totalPendingAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      currency: "USD",
      meta: `${stats.processing + stats.needsReview} awaiting approval`,
    },
    {
      label: "Needs Review",
      value: stats.needsReview.toString(),
      meta: "Action required",
      highlight: stats.needsReview > 0,
    },
    {
      label: "Approved",
      value: stats.approved.toString(),
      meta: `${stats.rejected} rejected`,
    },
    {
      label: "Duplicate Anomaly",
      value: stats.duplicateCount.toString(),
      meta: "Similarity match flagged",
      warning: stats.duplicateCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-zinc-200/80 bg-white p-4 shadow-2xs transition-all hover:border-zinc-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
              {item.label}
            </span>
            {item.warning && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono-nums">
              {item.value}
            </span>
            {item.currency && (
              <span className="text-xs font-mono text-zinc-400">
                {item.currency}
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{item.meta}</div>
        </div>
      ))}
    </div>
  );
}
