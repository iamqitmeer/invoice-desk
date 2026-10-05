import React, { useState } from "react";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { StatusBadge, DuplicateBadge } from "./Badge";
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  DollarSign,
  FileText,
  History,
  MessageSquare,
  ShieldAlert,
  Loader2,
} from "lucide-react";

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

  if (!isOpen || !invoice) return null;

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    await onUpdateStatus(invoice.id, newStatus, note.trim() || undefined);
    setNote("");
  };

  const formattedInvoiceDate = new Date(invoice.invoiceDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 font-bold text-zinc-200">
              {invoice.vendorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">
                  {invoice.invoiceNumber}
                </h3>
                <StatusBadge status={invoice.status} />
                {invoice.isDuplicate && (
                  <DuplicateBadge
                    onCompareClick={() => onOpenDuplicateCompare?.(invoice)}
                  />
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {invoice.vendorName} • {invoice.vendorCategory || "Vendor Billing"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Strip */}
        {invoice.isDuplicate && (
          <div className="px-6 py-3 bg-orange-950/40 border-b border-orange-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-orange-200">
              <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                <strong className="font-semibold">Duplicate Detected: </strong>
                {invoice.duplicateReason || "Matches earlier billing entry"}
              </span>
            </div>
            {onOpenDuplicateCompare && (
              <button
                type="button"
                onClick={() => onOpenDuplicateCompare(invoice)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 transition-colors shrink-0 cursor-pointer"
              >
                Compare Invoices
              </button>
            )}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-800/80 bg-zinc-900/20 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "details"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Invoice Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Audit Trail & History</span>
            <span className="px-1.5 py-0.2 bg-zinc-800 rounded-full text-[10px] text-zinc-400">
              {invoice.auditTrail?.length || 1}
            </span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "details" ? (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
                  <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                    Total Amount
                  </div>
                  <div className="text-lg font-bold text-zinc-100 mt-1">
                    ${invoice.amount.toFixed(2)}{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      {invoice.currency}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
                  <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Invoice Date
                  </div>
                  <div className="text-sm font-semibold text-zinc-200 mt-1">
                    {formattedInvoiceDate}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
                  <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    Payment Due
                  </div>
                  <div className="text-sm font-semibold text-zinc-200 mt-1">
                    {formattedDueDate}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
                  <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Building className="w-3.5 h-3.5 text-zinc-400" />
                    Vendor Account
                  </div>
                  <div className="text-sm font-semibold text-zinc-200 mt-1 truncate">
                    {invoice.vendorName}
                  </div>
                </div>
              </div>

              {/* Description */}
              {invoice.description && (
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Description & Scope
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {invoice.description}
                  </p>
                </div>
              )}

              {/* Itemized Table */}
              <div>
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Itemized Line Items
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">Description</th>
                        <th className="px-4 py-2.5 font-medium text-center">Qty</th>
                        <th className="px-4 py-2.5 font-medium text-right">Unit Price</th>
                        <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                      {invoice.lineItems && invoice.lineItems.length > 0 ? (
                        invoice.lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-900/60">
                            <td className="px-4 py-3 font-medium text-zinc-200">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-center text-zinc-400">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-zinc-400">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-zinc-100">
                              ${item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-zinc-500">
                            No individual line item details specified.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t border-zinc-800 bg-zinc-900/90 font-semibold text-zinc-100">
                      <tr>
                        <td colSpan={3} className="px-4 py-2.5 text-right text-zinc-400">
                          Total Due:
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm text-zinc-100">
                          ${invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Review History / Note */}
              {invoice.reviewNote && (
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
                  <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    Latest Reviewer Note
                  </div>
                  <p className="text-xs text-zinc-300 italic">
                    &quot;{invoice.reviewNote}&quot;
                  </p>
                  {invoice.reviewedBy && (
                    <p className="text-[10px] text-zinc-500">
                      Reviewed by {invoice.reviewedBy} on{" "}
                      {invoice.reviewedAt ? new Date(invoice.reviewedAt).toLocaleString() : "recently"}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Audit Trail Tab */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                System Event & Audit Logs
              </div>
              <div className="relative border-l-2 border-zinc-800 ml-3 space-y-6 py-2">
                {invoice.auditTrail && invoice.auditTrail.length > 0 ? (
                  invoice.auditTrail.map((entry) => (
                    <div key={entry.id} className="relative pl-6">
                      {/* Pulse bullet */}
                      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-zinc-950 bg-blue-500" />
                      <div className="text-xs font-semibold text-zinc-200">
                        {entry.action.replace("_", " ")}
                        {entry.fromStatus && entry.toStatus && (
                          <span className="text-zinc-400 font-normal">
                            {" "}(from {entry.fromStatus} → {entry.toStatus})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        By <span className="text-zinc-300 font-medium">{entry.actor}</span> •{" "}
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.note && (
                        <div className="mt-1.5 text-xs text-zinc-300 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800/80">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500 pl-6">
                    No recorded state mutations yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Panel Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add optional review note / approval justification..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center gap-2 shrink-0">
              {/* Reject */}
              <button
                type="button"
                disabled={isUpdating || invoice.status === "REJECTED"}
                onClick={() => handleStatusChange("REJECTED")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-500/30 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>Reject</span>
              </button>

              {/* Move to Needs Review */}
              {invoice.status !== "NEEDS_REVIEW" && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("NEEDS_REVIEW")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Flag Review</span>
                </button>
              )}

              {/* Approve */}
              <button
                type="button"
                disabled={isUpdating || invoice.status === "APPROVED"}
                onClick={() => handleStatusChange("APPROVED")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                )}
                <span>Approve Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
