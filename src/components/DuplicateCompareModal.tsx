import React from "react";
import { Invoice } from "@/types/invoice";
import { StatusBadge } from "./Badge";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";

interface DuplicateCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateInvoice: Invoice | null;
  originalInvoice: Invoice | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isUpdating: boolean;
}

export function DuplicateCompareModal({
  isOpen,
  onClose,
  duplicateInvoice,
  originalInvoice,
  onApprove,
  onReject,
  isUpdating,
}: DuplicateCompareModalProps) {
  if (!isOpen || !duplicateInvoice) return null;

  const isAmountMatch =
    originalInvoice && duplicateInvoice.amount === originalInvoice.amount;
  const isVendorMatch =
    originalInvoice &&
    duplicateInvoice.vendorName.toLowerCase() ===
      originalInvoice.vendorName.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-orange-500/30 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                Duplicate Anomaly Comparison
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-normal">
                  Risk Level: High
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Comparing flagged invoice against previously registered billing statement
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

        {/* Warning Banner */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Detection Reason: </span>
            {duplicateInvoice.duplicateReason ||
              "Identical amount and vendor matching previous invoice within billing cycle."}
          </div>
        </div>

        {/* Content Side by Side */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flagged Invoice */}
          <div className="rounded-xl border border-orange-500/30 bg-zinc-900/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-semibold uppercase text-orange-400">
                    Flagged New Submission
                  </span>
                  <h4 className="text-lg font-bold text-zinc-100 mt-0.5">
                    {duplicateInvoice.invoiceNumber}
                  </h4>
                </div>
                <StatusBadge status={duplicateInvoice.status} />
              </div>

              <div className="mt-4 space-y-3.5 text-sm">
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Vendor Name</div>
                  <div
                    className={`font-semibold mt-0.5 ${
                      isVendorMatch ? "text-amber-300 flex items-center gap-1.5" : "text-zinc-100"
                    }`}
                  >
                    {duplicateInvoice.vendorName}
                    {isVendorMatch && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-normal">
                        Matches Original
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 font-medium">Total Amount</div>
                  <div
                    className={`text-xl font-bold mt-0.5 ${
                      isAmountMatch ? "text-orange-300 flex items-center gap-1.5" : "text-zinc-100"
                    }`}
                  >
                    ${duplicateInvoice.amount.toFixed(2)} {duplicateInvoice.currency}
                    {isAmountMatch && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-orange-500/20 text-orange-300 rounded font-normal">
                        Exact Amount Match
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 font-medium">Invoice Date</div>
                  <div className="text-zinc-200 mt-0.5">
                    {new Date(duplicateInvoice.invoiceDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 font-medium">Description</div>
                  <div className="text-zinc-300 text-xs mt-0.5 leading-relaxed bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
                    {duplicateInvoice.description || "No description provided."}
                  </div>
                </div>

                {duplicateInvoice.lineItems && (
                  <div>
                    <div className="text-xs text-zinc-400 font-medium mb-1.5">Line Items</div>
                    <div className="space-y-1.5">
                      {duplicateInvoice.lineItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs bg-zinc-950/40 p-2 rounded border border-zinc-800/80"
                        >
                          <span className="text-zinc-300 truncate max-w-[200px]">
                            {item.description}
                          </span>
                          <span className="font-semibold text-zinc-200">
                            ${item.total.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions for Duplicate */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2">
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "REJECTED"}
                onClick={() => onReject(duplicateInvoice.id)}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50 cursor-pointer text-center"
              >
                Reject As Duplicate
              </button>
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "APPROVED"}
                onClick={() => onApprove(duplicateInvoice.id)}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Approve Anyway
              </button>
            </div>
          </div>

          {/* Original Existing Invoice */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-semibold uppercase text-zinc-400">
                    Original Existing Invoice
                  </span>
                  <h4 className="text-lg font-bold text-zinc-100 mt-0.5">
                    {originalInvoice ? originalInvoice.invoiceNumber : duplicateInvoice.duplicateOfInvoiceNumber || "INV-2024-001"}
                  </h4>
                </div>
                {originalInvoice && <StatusBadge status={originalInvoice.status} />}
              </div>

              {originalInvoice ? (
                <div className="mt-4 space-y-3.5 text-sm">
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Vendor Name</div>
                    <div className="font-semibold text-zinc-100 mt-0.5">
                      {originalInvoice.vendorName}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Total Amount</div>
                    <div className="text-xl font-bold text-zinc-100 mt-0.5">
                      ${originalInvoice.amount.toFixed(2)} {originalInvoice.currency}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Invoice Date</div>
                    <div className="text-zinc-200 mt-0.5">
                      {new Date(originalInvoice.invoiceDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Description</div>
                    <div className="text-zinc-300 text-xs mt-0.5 leading-relaxed bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
                      {originalInvoice.description || "No description provided."}
                    </div>
                  </div>

                  {originalInvoice.lineItems && (
                    <div>
                      <div className="text-xs text-zinc-400 font-medium mb-1.5">Line Items</div>
                      <div className="space-y-1.5">
                        {originalInvoice.lineItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-xs bg-zinc-950/40 p-2 rounded border border-zinc-800/80"
                          >
                            <span className="text-zinc-300 truncate max-w-[200px]">
                              {item.description}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              ${item.total.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-8 text-center py-10 text-xs text-zinc-500">
                  Original invoice records loaded via reference ID:{" "}
                  {duplicateInvoice.duplicateOfInvoiceNumber}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
              Historical reference record (read-only)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
