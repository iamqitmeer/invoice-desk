import React, { useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";
import { X, Loader2 } from "lucide-react";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: InvoiceStatus,
    reviewNote?: string
  ) => Promise<void>;
  onOpenDuplicateCompare?: (invoice: Invoice) => void;
  isUpdating: boolean;
}

export function InvoiceDetailModal({
  invoice,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenDuplicateCompare,
  isUpdating,
}: InvoiceDetailModalProps) {
  const [note, setNote] = useState("");
  const [showAudit, setShowAudit] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    await onUpdateStatus(invoice.id, newStatus, note.trim() || undefined);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-zinc-900">
              {invoice.invoiceNumber}
            </h3>
            <StatusBadge status={invoice.status} />
            {invoice.isDuplicate && (
              <DuplicateBadge
                onCompareClick={() => onOpenDuplicateCompare?.(invoice)}
              />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Banner */}
        {invoice.isDuplicate && (
          <div className="px-6 py-2.5 bg-orange-50 border-b border-orange-200 flex items-center justify-between text-xs text-orange-900">
            <div>
              <span className="font-semibold">Duplicate Warning: </span>
              {invoice.duplicateReason || "Matches previous invoice record."}
            </div>
            {onOpenDuplicateCompare && (
              <button
                type="button"
                onClick={() => onOpenDuplicateCompare(invoice)}
                className="font-medium underline hover:text-orange-950 ml-2 cursor-pointer"
              >
                Compare
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-700">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <div>
              <div className="text-zinc-400 font-medium">Vendor</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5">
                {invoice.vendorName}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 font-medium">Amount</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5">
                ${invoice.amount.toFixed(2)} {invoice.currency}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 font-medium">Invoice Date</div>
              <div className="font-medium text-zinc-800 mt-0.5">
                {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 font-medium">Due Date</div>
              <div className="font-medium text-zinc-800 mt-0.5">
                {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          {invoice.description && (
            <div>
              <div className="font-medium text-zinc-500 mb-1">Description</div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 leading-relaxed">
                {invoice.description}
              </div>
            </div>
          )}

          {/* Itemized Table */}
          <div>
            <div className="font-medium text-zinc-500 mb-2">Line Items</div>
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="px-3.5 py-2 font-medium">Item</th>
                    <th className="px-3.5 py-2 font-medium text-center">Qty</th>
                    <th className="px-3.5 py-2 font-medium text-right">Unit Price</th>
                    <th className="px-3.5 py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  {invoice.lineItems && invoice.lineItems.length > 0 ? (
                    invoice.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3.5 py-2.5 font-medium text-zinc-900">
                          {item.description}
                        </td>
                        <td className="px-3.5 py-2.5 text-center text-zinc-500">
                          {item.quantity}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-zinc-500">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-medium text-zinc-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3.5 py-3 text-center text-zinc-400">
                        No line items available
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t border-zinc-200 bg-zinc-50 font-semibold text-zinc-900">
                  <tr>
                    <td colSpan={3} className="px-3.5 py-2 text-right text-zinc-500">
                      Total:
                    </td>
                    <td className="px-3.5 py-2 text-right">
                      ${invoice.amount.toFixed(2)} {invoice.currency}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Audit Trail toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAudit(!showAudit)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer underline"
            >
              {showAudit ? "Hide audit trail" : `View audit trail (${invoice.auditTrail?.length || 0})`}
            </button>

            {showAudit && (
              <div className="mt-2 p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                {invoice.auditTrail && invoice.auditTrail.length > 0 ? (
                  invoice.auditTrail.map((entry) => (
                    <div key={entry.id} className="text-[11px] text-zinc-600 border-b border-zinc-200 last:border-0 pb-1.5 last:pb-0">
                      <div className="font-semibold text-zinc-800">
                        {entry.action} {entry.toStatus && `→ ${entry.toStatus}`}
                      </div>
                      <div className="text-zinc-400">
                        By {entry.actor} on {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.note && (
                        <div className="text-zinc-700 italic mt-0.5">
                          &quot;{entry.note}&quot;
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-400">No events recorded.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add optional review comment..."
            className="flex-1 bg-white border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
          />

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              disabled={isUpdating || invoice.status === "REJECTED"}
              onClick={() => handleStatusChange("REJECTED")}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Reject"}
            </button>

            {invoice.status !== "NEEDS_REVIEW" && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange("NEEDS_REVIEW")}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-amber-200 bg-white text-amber-800 hover:bg-amber-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Needs Review
              </button>
            )}

            <button
              type="button"
              disabled={isUpdating || invoice.status === "APPROVED"}
              onClick={() => handleStatusChange("APPROVED")}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Approve Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
