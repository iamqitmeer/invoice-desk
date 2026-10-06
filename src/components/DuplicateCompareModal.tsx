import React from "react";
import { Invoice } from "@/types/invoice";
import { StatusBadge } from "./Badge";
import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Duplicate Comparison
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Compare flagged invoice against existing billing record
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Note */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900">
          <span className="font-semibold">Reason: </span>
          {duplicateInvoice.duplicateReason || "Matches previous invoice record."}
        </div>

        {/* Side-by-Side Comparison */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Flagged Invoice */}
          <div className="rounded-lg border border-orange-200 bg-orange-50/20 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <span className="text-[11px] font-semibold text-orange-700 uppercase">
                    New Flagged Submission
                  </span>
                  <div className="text-base font-bold text-zinc-900 mt-0.5">
                    {duplicateInvoice.invoiceNumber}
                  </div>
                </div>
                <StatusBadge status={duplicateInvoice.status} />
              </div>

              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="text-zinc-400">Vendor</div>
                  <div className="font-semibold text-zinc-900">
                    {duplicateInvoice.vendorName}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">Amount</div>
                  <div className="font-semibold text-zinc-900 text-sm">
                    ${duplicateInvoice.amount.toFixed(2)} {duplicateInvoice.currency}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">Date</div>
                  <div className="text-zinc-700">
                    {new Date(duplicateInvoice.invoiceDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">Description</div>
                  <div className="text-zinc-600 mt-0.5">
                    {duplicateInvoice.description || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-200 flex items-center gap-2">
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "REJECTED"}
                onClick={() => onReject(duplicateInvoice.id)}
                className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Reject Duplicate
              </button>
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "APPROVED"}
                onClick={() => onApprove(duplicateInvoice.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Approve Anyway
              </button>
            </div>
          </div>

          {/* Original Record */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase">
                    Original In Database
                  </span>
                  <div className="text-base font-bold text-zinc-900 mt-0.5">
                    {originalInvoice ? originalInvoice.invoiceNumber : duplicateInvoice.duplicateOfInvoiceNumber}
                  </div>
                </div>
                {originalInvoice && <StatusBadge status={originalInvoice.status} />}
              </div>

              {originalInvoice ? (
                <div className="mt-3 space-y-2.5">
                  <div>
                    <div className="text-zinc-400">Vendor</div>
                    <div className="font-semibold text-zinc-900">
                      {originalInvoice.vendorName}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Amount</div>
                    <div className="font-semibold text-zinc-900 text-sm">
                      ${originalInvoice.amount.toFixed(2)} {originalInvoice.currency}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Date</div>
                    <div className="text-zinc-700">
                      {new Date(originalInvoice.invoiceDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Description</div>
                    <div className="text-zinc-600 mt-0.5">
                      {originalInvoice.description || "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center text-zinc-400">
                  Original invoice loaded via reference ID
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-200 text-[11px] text-zinc-400 text-center">
              Historical reference (read-only)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
