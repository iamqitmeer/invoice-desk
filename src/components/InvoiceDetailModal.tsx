import React, { useState, useEffect } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";
import { X, Loader2, ArrowRight, Copy, Check } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details");
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !invoice) return null;

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    await onUpdateStatus(invoice.id, newStatus, note.trim() || undefined);
    setNote("");
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(invoice.invoiceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 cursor-default"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/75">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              title="Click to copy invoice number"
              className="group flex items-center gap-1.5 font-mono font-bold text-base text-zinc-950 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>{invoice.invoiceNumber}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
              )}
            </button>
            <StatusBadge status={invoice.status} />
            {invoice.isDuplicate && (
              <DuplicateBadge
                referenceId={invoice.duplicateOfInvoiceNumber}
                onCompareClick={() => onOpenDuplicateCompare?.(invoice)}
              />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close (Esc)"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Alert Banner */}
        {invoice.isDuplicate && (
          <div className="px-6 py-2.5 bg-orange-50/90 border-b border-orange-200 flex items-center justify-between text-xs text-orange-900">
            <div>
              <span className="font-semibold">Similarity Match: </span>
              {invoice.duplicateReason || "Matches previous invoice billing record."}
            </div>
            {onOpenDuplicateCompare && (
              <button
                type="button"
                onClick={() => onOpenDuplicateCompare(invoice)}
                className="font-semibold underline hover:text-orange-950 ml-3 shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>Compare side-by-side</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-200 bg-zinc-50/30 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "details"
                ? "border-zinc-900 text-zinc-950 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Invoice Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "border-zinc-900 text-zinc-950 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>Audit Trail</span>
            <span className="px-1.5 py-0.2 rounded-sm bg-zinc-200 text-zinc-700 text-[10px] font-mono">
              {invoice.auditTrail?.length || 1}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-700">
          {activeTab === "details" ? (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Vendor
                  </div>
                  <div className="font-semibold text-zinc-900 text-sm mt-0.5 truncate">
                    {invoice.vendorName}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Total Amount
                  </div>
                  <div className="font-mono-nums font-bold text-zinc-950 text-sm mt-0.5">
                    ${invoice.amount.toFixed(2)}{" "}
                    <span className="text-[10px] font-mono text-zinc-400">
                      {invoice.currency}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Invoice Date
                  </div>
                  <div className="font-mono-nums font-medium text-zinc-800 mt-0.5">
                    {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Payment Due
                  </div>
                  <div className="font-mono-nums font-medium text-zinc-800 mt-0.5">
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
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Description &amp; Line Scope
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-zinc-700 leading-relaxed">
                    {invoice.description}
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-400 mb-2">
                  Itemized Charges
                </div>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200 font-mono text-[11px]">
                      <tr>
                        <th className="px-3.5 py-2 font-medium">Description</th>
                        <th className="px-3.5 py-2 font-medium text-center">Qty</th>
                        <th className="px-3.5 py-2 font-medium text-right">Unit Price</th>
                        <th className="px-3.5 py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800">
                      {invoice.lineItems && invoice.lineItems.length > 0 ? (
                        invoice.lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3.5 py-2.5 font-medium text-zinc-900">
                              {item.description}
                            </td>
                            <td className="px-3.5 py-2.5 text-center font-mono-nums text-zinc-500">
                              {item.quantity}
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-mono-nums text-zinc-500">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-mono-nums font-semibold text-zinc-900">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-3.5 py-3 text-center text-zinc-400">
                            No individual line items specified
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t border-zinc-200 bg-zinc-50/75 font-semibold text-zinc-900 font-mono-nums">
                      <tr>
                        <td colSpan={3} className="px-3.5 py-2 text-right text-zinc-500 font-sans font-medium text-xs">
                          Total Due:
                        </td>
                        <td className="px-3.5 py-2 text-right text-sm">
                          ${invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Latest Reviewer Note */}
              {invoice.reviewNote && (
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                  <div className="font-semibold text-zinc-900 mb-0.5">
                    Latest Decision Note
                  </div>
                  <div className="text-zinc-600 italic">
                    &quot;{invoice.reviewNote}&quot;
                  </div>
                  {invoice.reviewedBy && (
                    <div className="text-[10px] font-mono text-zinc-400 mt-1">
                      By {invoice.reviewedBy} on{" "}
                      {invoice.reviewedAt
                        ? new Date(invoice.reviewedAt).toLocaleString()
                        : "recent"}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Audit Trail Tab */
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Event History &amp; State Logs
              </div>
              <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-100 bg-zinc-50/40">
                {invoice.auditTrail && invoice.auditTrail.length > 0 ? (
                  invoice.auditTrail.map((entry) => (
                    <div key={entry.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-zinc-900">
                          {entry.action}{" "}
                          {entry.toStatus && `→ ${entry.toStatus}`}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Actor: {entry.actor} •{" "}
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                      {entry.note && (
                        <div className="text-zinc-700 mt-1.5 p-2 rounded bg-white border border-zinc-200/80">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-400">
                    No state history recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add optional review comment / reason..."
            className="flex-1 bg-white border border-zinc-200 rounded-md px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
          />

          <div className="flex items-center gap-2 justify-end shrink-0">
            <button
              type="button"
              disabled={isUpdating || invoice.status === "REJECTED"}
              onClick={() => handleStatusChange("REJECTED")}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Reject"}
            </button>

            {invoice.status !== "NEEDS_REVIEW" && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange("NEEDS_REVIEW")}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-amber-200 bg-white text-amber-900 hover:bg-amber-50 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                Flag Review
              </button>
            )}

            <button
              type="button"
              disabled={isUpdating || invoice.status === "APPROVED"}
              onClick={() => handleStatusChange("APPROVED")}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-950 text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Approve Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
