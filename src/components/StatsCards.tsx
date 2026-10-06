import React from "react";
import { InvoicesStats } from "@/types/invoice";
import { DollarSign, AlertTriangle, CheckCircle2, Layers } from "lucide-react";

interface StatsCardsProps {
  stats: InvoicesStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-zinc-800/80 bg-zinc-900/40 animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Pending Review Amount",
      value: `$${stats.totalPendingAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: `${stats.processing + stats.needsReview} invoices awaiting approval`,
      icon: DollarSign,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Needs Review",
      value: stats.needsReview.toString(),
      subtitle: "Requires human authorization",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Approved & Resolved",
      value: `${stats.approved} / ${stats.total}`,
      subtitle: `${stats.rejected} rejected / filtered`,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Duplicate Anomaly Alerts",
      value: stats.duplicateCount.toString(),
      subtitle: "Similarity rule triggered",
      icon: Layers,
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`p-2 rounded-lg ${card.bgColor} ${card.borderColor} border`}
              >
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-zinc-100 tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
