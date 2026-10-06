import React from "react";
import { FileSpreadsheet, RotateCcw, Search } from "lucide-react";

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
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-inner">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-zinc-100 tracking-tight">
                  Sledge Invoice Desk
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Builder Desk
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Financial Operations &amp; Automated Approval Control
              </p>
            </div>
          </div>

          {/* Search and Database Action controls */}
          <div className="flex items-center gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search vendor, invoice #..."
                className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Reset Database to Original Seed */}
            <button
              type="button"
              onClick={onResetSeed}
              disabled={isResetting}
              title="Reset data back to initial 6 test invoices"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 text-zinc-400 ${
                  isResetting ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Reset Seed Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
