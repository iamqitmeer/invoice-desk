"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Invoice,
  InvoiceStatus,
  InvoicesStats,
} from "@/types/invoice";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { TabNav, TabKey } from "@/components/TabNav";
import { InvoiceTable } from "@/components/InvoiceTable";
import { InvoiceDetailModal } from "@/components/InvoiceDetailModal";
import { DuplicateCompareModal } from "@/components/DuplicateCompareModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { RefreshCw } from "lucide-react";

export default function InvoiceDeskPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoicesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [duplicateFilter, setDuplicateFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [compareData, setCompareData] = useState<{
    duplicate: Invoice;
    original: Invoice | null;
  } | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const addToast = useCallback(
    (type: "success" | "error" | "info", message: string, description?: string) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, description }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== "ALL") {
        params.append("status", activeTab);
      }
      if (duplicateFilter) {
        params.append("duplicateOnly", "true");
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/invoices?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setInvoices(data.data);
        setStats(data.stats);
      } else {
        addToast("error", "Failed to load invoices", data.error);
      }
    } catch (err) {
      console.error(err);
      addToast("error", "Network error", "Unable to connect to invoice desk API");
    } finally {
      setLoading(false);
    }
  }, [activeTab, duplicateFilter, searchQuery, addToast]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (activeTab !== "ALL") params.append("status", activeTab);
        if (duplicateFilter) params.append("duplicateOnly", "true");
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await fetch(`/api/invoices?${params.toString()}`);
        const data = await res.json();

        if (isMounted && data.success) {
          setInvoices(data.data);
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [activeTab, duplicateFilter, searchQuery]);

  // Update Status handler
  const handleUpdateStatus = async (
    id: string,
    newStatus: InvoiceStatus,
    reviewNote?: string
  ) => {
    try {
      setIsUpdating(true);
      setUpdatingId(id);

      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reviewNote: reviewNote || undefined,
          reviewedBy: "Sledge Operations Lead",
        }),
      });

      const result = await res.json();

      if (result.success && result.data) {
        const updatedInvoice: Invoice = result.data;
        addToast(
          "success",
          `Status updated: ${newStatus}`,
          `Invoice ${updatedInvoice.invoiceNumber} persisted to database.`
        );

        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? updatedInvoice : inv))
        );

        if (selectedInvoice && selectedInvoice.id === id) {
          setSelectedInvoice(updatedInvoice);
        }

        if (compareData && compareData.duplicate.id === id) {
          setCompareData((prev) =>
            prev ? { ...prev, duplicate: updatedInvoice } : null
          );
        }

        fetchInvoices();
      } else {
        addToast("error", "Update failed", result.error || "Could not save status");
      }
    } catch (err) {
      console.error(err);
      addToast("error", "Network error", "Failed to update invoice status");
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  const handleQuickApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus(id, "APPROVED");
  };

  const handleQuickReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus(id, "REJECTED");
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleOpenDuplicateCompare = async (duplicateInv: Invoice) => {
    let original: Invoice | null = null;
    const originalRef = duplicateInv.duplicateOfInvoiceNumber || "INV-2024-001";

    try {
      const res = await fetch(`/api/invoices/${originalRef}`);
      const data = await res.json();
      if (data.success && data.data) {
        original = data.data;
      }
    } catch (e) {
      console.error("Could not fetch original invoice for comparison:", e);
    }

    setCompareData({
      duplicate: duplicateInv,
      original: original,
    });
    setIsCompareOpen(true);
  };

  const handleResetSeed = async () => {
    try {
      setIsResetting(true);
      const res = await fetch("/api/invoices/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        addToast("success", "Database Reset", "Restored 6 canonical sample invoices.");
        fetchInvoices();
        setIsDetailOpen(false);
        setIsCompareOpen(false);
      } else {
        addToast("error", "Reset failed", data.error);
      }
    } catch (err) {
      console.error(err);
      addToast("error", "Reset failed", "Could not restore seed dataset");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900">
      {/* Header */}
      <Header
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Metrics Grid */}
        <StatsCards stats={stats} loading={loading && !stats} />

        {/* Workspace Invoices Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-zinc-950 tracking-tight">
                Approval Queue
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Inspect incoming contractor &amp; SaaS billing statements, cross-verify duplicates, and persist decisions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchInvoices();
              }}
              disabled={loading}
              title="Refresh queue"
              className="p-1.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-zinc-900" : ""}`}
              />
            </button>
          </div>

          {/* Segmented Filter Tabs */}
          <TabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={stats}
            duplicateFilter={duplicateFilter}
            onToggleDuplicateFilter={() => setDuplicateFilter(!duplicateFilter)}
          />

          {/* Table Container */}
          <InvoiceTable
            invoices={invoices}
            loading={loading}
            onSelectInvoice={handleSelectInvoice}
            onQuickApprove={handleQuickApprove}
            onQuickReject={handleQuickReject}
            onOpenDuplicateCompare={handleOpenDuplicateCompare}
            isUpdatingId={updatingId}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Sledge Desk • TypeScript API + Database Status Persistence</span>
          </div>
          <div className="text-[11px]">Submission by Muhammad Qitmeer</div>
        </div>
      </footer>

      {/* Detail Slide-over / Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onOpenDuplicateCompare={handleOpenDuplicateCompare}
        isUpdating={isUpdating}
      />

      {/* Duplicate Comparison Side-by-Side Modal */}
      <DuplicateCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        duplicateInvoice={compareData?.duplicate || null}
        originalInvoice={compareData?.original || null}
        onApprove={(id) => handleUpdateStatus(id, "APPROVED")}
        onReject={(id) => handleUpdateStatus(id, "REJECTED")}
        isUpdating={isUpdating}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
