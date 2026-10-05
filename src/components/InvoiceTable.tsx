import React from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";
import {
  ArrowUpDown,
  ExternalLink,
  Check,
  X,
  Layers,
  Inbox,
  Sparkles,
} from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onSelectInvoice: (invoice: Invoice) => void;
  onQuickApprove: (id: string, e: React.MouseEvent) => void;
  onQuickReject: (id: string, e: React.MouseEvent) => void;
  onOpenDuplicateCompare: (invoice: Invoice) => void;
  isUpdatingId: string | null;
}

export function InvoiceTable({
  invoices,
  loading,
  onSelectInvoice,
  onQuickApprove,
  onQuickReject,
  onOpenDuplicateCompare,
  isUpdatingId,
}: InvoiceTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-zinc-800/40 animate-pulse w-full"
          />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 mb-3">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-200">
          No invoices found
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          No invoices match the selected filter criteria or search query. Try switching tabs or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 select-none">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Invoice & Vendor</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Anomaly Check</th>
              <th className="px-5 py-3.5 font-semibold text-right">Amount</th>
              <th className="px-5 py-3.5 font-semibold">Invoice Date</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {invoices.map((inv) => {
              const isUpdating = isUpdatingId === inv.id;

              return (
                <tr
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="group hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  {/* Vendor & Invoice ID */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/70 text-zinc-200 font-bold shrink-0 group-hover:border-zinc-500 transition-colors">
                        {inv.vendorName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-100 flex items-center gap-2">
                          <span>{inv.invoiceNumber}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate mt-0.5 max-w-[200px] sm:max-w-[280px]">
                          {inv.vendorName} • {inv.vendorCategory || "Expense"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Duplicate / Risk flag */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {inv.isDuplicate ? (
                      <DuplicateBadge
                        onCompareClick={() => onOpenDuplicateCompare(inv)}
                      />
                    ) : (
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500/60" />
                        Clean record
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="font-bold text-sm text-zinc-100 font-mono">
                      ${inv.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {inv.currency}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 whitespace-nowrap text-zinc-400">
                    <div>
                      {new Date(inv.invoiceDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Due:{" "}
                      {new Date(inv.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>

                  {/* Quick Actions */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Quick Approve */}
                      {inv.status !== "APPROVED" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => onQuickApprove(inv.id, e)}
                          title="Quick Approve"
                          className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Quick Reject */}
                      {inv.status !== "REJECTED" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => onQuickReject(inv.id, e)}
                          title="Quick Reject"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 border border-rose-500/20 hover:border-rose-500/40 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => onSelectInvoice(inv)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 font-medium transition-colors border border-zinc-700/60 cursor-pointer"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
