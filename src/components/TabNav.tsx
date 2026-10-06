import React from "react";
import { InvoiceStatus, InvoicesStats } from "@/types/invoice";

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
  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: stats ? stats.total : 0 },
    { key: "PROCESSING", label: "Processing", count: stats ? stats.processing : 0 },
    { key: "NEEDS_REVIEW", label: "Needs Review", count: stats ? stats.needsReview : 0 },
    { key: "APPROVED", label: "Approved", count: stats ? stats.approved : 0 },
    { key: "REJECTED", label: "Rejected", count: stats ? stats.rejected : 0 },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      {/* Segmented Control Pill Container */}
      <div className="inline-flex p-1 rounded-lg bg-zinc-100/90 border border-zinc-200/80 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white text-zinc-950 font-semibold shadow-2xs border border-zinc-200/60"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-sm text-[10px] font-mono ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "bg-zinc-200/60 text-zinc-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Duplicate Filter Pill */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onToggleDuplicateFilter}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
            duplicateFilter
              ? "bg-orange-50 border-orange-200 text-orange-900 font-semibold shadow-2xs"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              duplicateFilter ? "bg-orange-500" : "bg-zinc-400"
            }`}
          />
          <span>Duplicates Only</span>
          {stats && stats.duplicateCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                duplicateFilter
                  ? "bg-orange-200/60 text-orange-950 font-bold"
                  : "bg-zinc-100 text-zinc-500"
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
