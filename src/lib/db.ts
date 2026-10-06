import fs from "fs";
import path from "path";
import {
  Invoice,
  InvoiceStatus,
  InvoicesFilterParams,
  InvoicesStats,
} from "@/types/invoice";
import { INITIAL_INVOICES } from "./seed-data";

// Data directory and local persistence file for instant out-of-the-box reliability
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "invoices.json");

// In-memory fallback / cache for global server lifetime
declare global {
  var __INVOICES_STORE__: Invoice[] | undefined;
}

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(
        DB_FILE,
        JSON.stringify(INITIAL_INVOICES, null, 2),
        "utf-8"
      );
      global.__INVOICES_STORE__ = [...INITIAL_INVOICES];
    }
  } catch (err) {
    console.warn("Could not write to local disk, falling back to memory store:", err);
    if (!global.__INVOICES_STORE__) {
      global.__INVOICES_STORE__ = [...INITIAL_INVOICES];
    }
  }
}

function readStore(): Invoice[] {
  if (global.__INVOICES_STORE__ && global.__INVOICES_STORE__.length > 0) {
    return global.__INVOICES_STORE__;
  }

  try {
    ensureDataFile();
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content) as Invoice[];
      global.__INVOICES_STORE__ = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Failed reading DB file, using fallback:", err);
  }

  global.__INVOICES_STORE__ = [...INITIAL_INVOICES];
  return global.__INVOICES_STORE__;
}

function writeStore(invoices: Invoice[]): void {
  global.__INVOICES_STORE__ = invoices;
  try {
    ensureDataFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(invoices, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed persisting to disk:", err);
  }
}

export async function getInvoices(
  filters?: InvoicesFilterParams
): Promise<Invoice[]> {
  const store = readStore();
  let result = [...store];

  if (filters?.status && filters.status !== "ALL") {
    result = result.filter((inv) => inv.status === filters.status);
  }

  if (filters?.duplicateOnly) {
    result = result.filter((inv) => inv.isDuplicate);
  }

  if (filters?.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.vendorName.toLowerCase().includes(q) ||
        inv.description?.toLowerCase().includes(q) ||
        inv.vendorCategory?.toLowerCase().includes(q)
    );
  }

  // Sort: most recent updated or created first
  result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return result;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const store = readStore();
  const invoice = store.find((inv) => inv.id === id || inv.invoiceNumber === id);
  return invoice || null;
}

export async function updateInvoiceStatus(
  id: string,
  newStatus: InvoiceStatus,
  reviewNote?: string,
  reviewedBy: string = "Finance Reviewer"
): Promise<Invoice | null> {
  const store = readStore();
  const index = store.findIndex(
    (inv) => inv.id === id || inv.invoiceNumber === id
  );

  if (index === -1) {
    return null;
  }

  const existing = store[index];
  const now = new Date().toISOString();

  const auditEntry = {
    id: `aud_${Date.now()}`,
    action: "STATUS_CHANGED" as const,
    fromStatus: existing.status,
    toStatus: newStatus,
    note: reviewNote || `Status changed from ${existing.status} to ${newStatus}`,
    actor: reviewedBy,
    timestamp: now,
  };

  const updatedInvoice: Invoice = {
    ...existing,
    status: newStatus,
    reviewNote: reviewNote || existing.reviewNote,
    reviewedBy: reviewedBy,
    reviewedAt: now,
    updatedAt: now,
    auditTrail: [auditEntry, ...(existing.auditTrail || [])],
  };

  store[index] = updatedInvoice;
  writeStore(store);

  return updatedInvoice;
}

export async function resetAndSeedDatabase(): Promise<Invoice[]> {
  writeStore(INITIAL_INVOICES);
  return [...INITIAL_INVOICES];
}

export async function getInvoicesStats(): Promise<InvoicesStats> {
  const store = readStore();

  const stats: InvoicesStats = {
    total: store.length,
    processing: 0,
    needsReview: 0,
    approved: 0,
    rejected: 0,
    duplicateCount: 0,
    totalPendingAmount: 0,
    currency: "USD",
  };

  for (const inv of store) {
    if (inv.status === "PROCESSING") stats.processing += 1;
    if (inv.status === "NEEDS_REVIEW") stats.needsReview += 1;
    if (inv.status === "APPROVED") stats.approved += 1;
    if (inv.status === "REJECTED") stats.rejected += 1;
    if (inv.isDuplicate) stats.duplicateCount += 1;

    if (inv.status === "PROCESSING" || inv.status === "NEEDS_REVIEW") {
      stats.totalPendingAmount += inv.amount;
    }
  }

  return stats;
}
