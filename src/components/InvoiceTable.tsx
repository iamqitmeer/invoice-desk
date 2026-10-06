import React from "react";
import { Invoice } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";

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
      <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 rounded bg-zinc-100 animate-pulse w-full" />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
        <h3 className="text-sm font-medium text-zinc-900">No invoices found</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Try clearing search or switching to another tab.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 select-none">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-200 text-zinc-700">
            {invoices.map((inv) => {
              const isUpdating = isUpdatingId === inv.id;

              return (
                <tr
                  key={inv.id}
                  onClick={() => onSelectInvoice(inv)}
                  className="hover:bg-zinc-50/80 transition-colors cursor-pointer"
                >
                  {/* Invoice Number & Duplicate Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">
                        {inv.invoiceNumber}
                      </span>
                      {inv.isDuplicate && (
                        <DuplicateBadge
                          onCompareClick={() => onOpenDuplicateCompare(inv)}
                        />
                      )}
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-zinc-900">{inv.vendorName}</div>
                    <div className="text-[11px] text-zinc-400">
                      {inv.vendorCategory || "Expense"}
                    </div>
                  </td>

                  {/* Description Preview */}
                  <td className="px-4 py-3.5 max-w-[240px] truncate text-zinc-500">
                    {inv.description || "—"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="font-medium text-zinc-900">
                      ${inv.amount.toFixed(2)}
                    </span>{" "}
                    <span className="text-[11px] text-zinc-400">{inv.currency}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-500">
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
                          className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {inv.status !== "REJECTED" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => onQuickReject(inv.id, e)}
                          className="px-2.5 py-1 rounded text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectInvoice(inv)}
                        className="px-2.5 py-1 rounded text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                      >
                        View
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
