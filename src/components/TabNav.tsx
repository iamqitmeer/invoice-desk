import React from "react";
import { InvoiceStatus, InvoicesStats } from "@/types/invoice";
import { Clock, AlertTriangle, CheckCircle2, XCircle, ListFilter, Copy } from "lucide-react";

export type TabKey = "ALL" | InvoiceStatus;

interface TabNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  stats: InvoicesStats | null;
  duplicateFilter: boolean;
  onToggleDuplicateFilter: () => void;
}

export function TabNav({
  activeTab,
  onTabChange,
  stats,
  duplicateFilter,
  onToggleDuplicateFilter,
}: TabNavProps) {
  const tabs: {
    key: TabKey;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor?: string;
  }[] = [
    {
      key: "ALL",
      label: "All Invoices",
      count: stats ? stats.total : 0,
      icon: ListFilter,
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: stats ? stats.processing : 0,
      icon: Clock,
      accentColor: "text-blue-400",
    },
    {
      key: "NEEDS_REVIEW",
      label: "Needs Review",
      count: stats ? stats.needsReview : 0,
      icon: AlertTriangle,
      accentColor: "text-amber-400",
    },
    {
      key: "APPROVED",
      label: "Approved",
      count: stats ? stats.approved : 0,
      icon: CheckCircle2,
      accentColor: "text-emerald-400",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      count: stats ? stats.rejected : 0,
      icon: XCircle,
      accentColor: "text-rose-400",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
      {/* Scrollable Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/80"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? tab.accentColor || "text-zinc-200"
                    : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-zinc-800/80 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Duplicate Filter Toggle */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onToggleDuplicateFilter}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            duplicateFilter
              ? "border-orange-500/50 bg-orange-950/40 text-orange-300 shadow-sm"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
          }`}
        >
          <Copy className="w-3.5 h-3.5 text-orange-400" />
          <span>Flagged Duplicates Only</span>
          {stats && stats.duplicateCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                duplicateFilter
                  ? "bg-orange-500/20 text-orange-200"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {stats.duplicateCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
