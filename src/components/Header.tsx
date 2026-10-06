import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface HeaderProps {
  onResetSeed: () => void;
  isResetting: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  onResetSeed,
  isResetting,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white font-semibold text-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900">
                  Invoice Approval Desk
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Sledge
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search vendor or invoice..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={onResetSeed}
              disabled={isResetting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 text-zinc-500 ${isResetting ? "animate-spin" : ""}`}
              />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
