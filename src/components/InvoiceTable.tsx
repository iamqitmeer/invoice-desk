import React, { useState } from "react";
import { Invoice } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";
import { Check, X, ArrowUpRight, Copy, CheckCheck, ArrowUpDown } from "lucide-react";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "vendor">("date");
  const [sortAsc, setSortAsc] = useState(false);

  const handleCopy = (id: string, num: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (field: "date" | "amount" | "vendor") => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortBy === "amount") {
      return sortAsc ? a.amount - b.amount : b.amount - a.amount;
    }
    if (sortBy === "vendor") {
      return sortAsc
        ? a.vendorName.localeCompare(b.vendorName)
        : b.vendorName.localeCompare(a.vendorName);
    }
    const timeA = new Date(a.invoiceDate).getTime();
    const timeB = new Date(b.invoiceDate).getTime();
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200/80 bg-white p-6 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-11 rounded bg-zinc-100 animate-pulse w-full" />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200/80 bg-white p-12 text-center">
        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center font-mono text-xs">
          00
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mt-3">
          No invoices match filters
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Adjust your active filter tab or clear your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Header with sorting triggers */}
          <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 select-none">
            <tr>
              <th className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider">
                Invoice
              </th>
              <th
                onClick={() => handleSort("vendor")}
                className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider cursor-pointer hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Vendor</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider">
                Category
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider text-right cursor-pointer hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("date")}
                className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider cursor-pointer hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Billing Date</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 font-mono font-medium uppercase text-[11px] tracking-wider text-right">
                Quick Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {sortedInvoices.map((inv) => {
              const isUpdating = isUpdatingId === inv.id;
              const isCopied = copiedId === inv.id;

              return (
                <tr
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="group hover:bg-zinc-50/80 transition-colors cursor-pointer"
                >
                  {/* Invoice # & Duplicate Flag */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(inv.id, inv.invoiceNumber, e)}
                        title="Copy invoice ID"
                        className="group/copy flex items-center gap-1 font-mono font-semibold text-zinc-950 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span>{inv.invoiceNumber}</span>
                        {isCopied ? (
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-zinc-300 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                        )}
                      </button>
                      {inv.isDuplicate && (
                        <DuplicateBadge
                          referenceId={inv.duplicateOfInvoiceNumber}
                          onCompareClick={() => onOpenDuplicateCompare(inv)}
                        />
                      )}
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-700">
                        {inv.vendorName.charAt(0)}
                      </div>
                      <span className="font-medium text-zinc-900">
                        {inv.vendorName}
                      </span>
                    </div>
                  </td>

                  {/* Category / Scope */}
                  <td className="px-4 py-3.5 max-w-[200px] truncate text-zinc-500">
                    {inv.vendorCategory || inv.description || "General expense"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="font-mono-nums font-semibold text-zinc-950 text-sm">
                      ${inv.amount.toFixed(2)}
                    </span>{" "}
                    <span className="text-[10px] font-mono text-zinc-400">
                      {inv.currency}
                    </span>
                  </td>

                  {/* Billing Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-500 font-mono-nums">
                    {new Date(inv.invoiceDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {inv.status !== "APPROVED" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => onQuickApprove(inv.id, e)}
                          title="Approve Invoice"
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Approve</span>
                        </button>
                      )}

                      {inv.status !== "REJECTED" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => onQuickReject(inv.id, e)}
                          title="Reject Invoice"
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-rose-700 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
                        >
                          <X className="w-3 h-3 text-rose-500" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectInvoice(inv)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
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
