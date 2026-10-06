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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200">
      {/* Clean Tab List */}
      <div className="flex items-center gap-1 overflow-x-auto -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-zinc-900 text-zinc-900 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[11px] ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Duplicate Filter */}
      <div className="flex items-center gap-2 pb-2 sm:pb-0">
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={duplicateFilter}
            onChange={onToggleDuplicateFilter}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
          />
          <span>Duplicates only</span>
        </label>
      </div>
    </div>
  );
}
