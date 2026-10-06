import React, { useEffect } from "react";
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

  if (!isOpen || !duplicateInvoice) return null;

  const isAmountMatch =
    originalInvoice && duplicateInvoice.amount === originalInvoice.amount;
  const isVendorMatch =
    originalInvoice &&
    duplicateInvoice.vendorName.toLowerCase() ===
      originalInvoice.vendorName.toLowerCase();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 cursor-default"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
              <span>Duplicate Anomaly Comparison</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-orange-100 text-orange-800 border border-orange-200">
                Rule: Similarity &gt; 95%
              </span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Side-by-side inspection between flagged submission and registered billing record
            </p>
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

        {/* Reason Alert */}
        <div className="px-6 py-2.5 bg-amber-50/80 border-b border-amber-200 text-xs text-amber-900">
          <span className="font-semibold">Anomaly Trigger: </span>
          {duplicateInvoice.duplicateReason || "Matches previous billing statement."}
        </div>

        {/* Side by Side Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Flagged Invoice */}
          <div className="rounded-lg border border-orange-200 bg-orange-50/15 p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-orange-200/80">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-orange-700">
                    Flagged New Submission
                  </span>
                  <div className="text-base font-bold font-mono text-zinc-950 mt-0.5">
                    {duplicateInvoice.invoiceNumber}
                  </div>
                </div>
                <StatusBadge status={duplicateInvoice.status} />
              </div>

              <div className="mt-3.5 space-y-3">
                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Vendor
                  </div>
                  <div className="font-semibold text-zinc-900 mt-0.5 flex items-center justify-between">
                    <span>{duplicateInvoice.vendorName}</span>
                    {isVendorMatch && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1 rounded">
                        Vendor Match
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Total Amount
                  </div>
                  <div className="font-mono-nums font-bold text-zinc-950 text-base mt-0.5 flex items-center justify-between">
                    <span>${duplicateInvoice.amount.toFixed(2)} {duplicateInvoice.currency}</span>
                    {isAmountMatch && (
                      <span className="text-[10px] font-mono text-orange-700 bg-orange-100 px-1 rounded font-normal">
                        Identical Amount
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Invoice Date
                  </div>
                  <div className="font-mono-nums text-zinc-700 mt-0.5">
                    {new Date(duplicateInvoice.invoiceDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    Description
                  </div>
                  <div className="text-zinc-600 mt-0.5 bg-white p-2 rounded border border-zinc-200">
                    {duplicateInvoice.description || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-orange-200/80 flex items-center gap-2">
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "REJECTED"}
                onClick={() => onReject(duplicateInvoice.id)}
                className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-40 cursor-pointer shadow-2xs text-center"
              >
                Reject As Duplicate
              </button>
              <button
                type="button"
                disabled={isUpdating || duplicateInvoice.status === "APPROVED"}
                onClick={() => onApprove(duplicateInvoice.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                Approve
              </button>
            </div>
          </div>

          {/* Original Existing Invoice */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-500">
                    Existing Record in System
                  </span>
                  <div className="text-base font-bold font-mono text-zinc-950 mt-0.5">
                    {originalInvoice ? originalInvoice.invoiceNumber : duplicateInvoice.duplicateOfInvoiceNumber}
                  </div>
                </div>
                {originalInvoice && <StatusBadge status={originalInvoice.status} />}
              </div>

              {originalInvoice ? (
                <div className="mt-3.5 space-y-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      Vendor
                    </div>
                    <div className="font-semibold text-zinc-900 mt-0.5">
                      {originalInvoice.vendorName}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      Total Amount
                    </div>
                    <div className="font-mono-nums font-bold text-zinc-950 text-base mt-0.5">
                      ${originalInvoice.amount.toFixed(2)} {originalInvoice.currency}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      Invoice Date
                    </div>
                    <div className="font-mono-nums text-zinc-700 mt-0.5">
                      {new Date(originalInvoice.invoiceDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      Description
                    </div>
                    <div className="text-zinc-600 mt-0.5 bg-white p-2 rounded border border-zinc-200">
                      {originalInvoice.description || "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center text-zinc-400">
                  Original invoice records referenced via {duplicateInvoice.duplicateOfInvoiceNumber}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-200 text-[11px] text-zinc-400 text-center font-mono">
              Historical Reference Record (Read-Only)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer shadow-2xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
