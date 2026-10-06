import React, { useEffect, useRef } from "react";
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
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 py-3.5">
          {/* Logo & System Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-950 text-white font-bold text-xs tracking-wider shadow-xs">
              ID
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-950 tracking-tight">
                  Invoice Approval Desk
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Finance Portal
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar & Reset Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search vendor, amount, invoice #..."
                className="w-full bg-zinc-50 border border-zinc-200/90 rounded-md pl-8 pr-8 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all font-sans"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-2.5 top-2 text-[10px] font-mono text-zinc-400 bg-zinc-200/60 px-1 py-0.2 rounded select-none pointer-events-none">
                  /
                </span>
              )}
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onResetSeed}
              disabled={isResetting}
              title="Reset database back to initial 6 test invoices"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-all disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 text-zinc-500 ${isResetting ? "animate-spin" : ""}`}
              />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
