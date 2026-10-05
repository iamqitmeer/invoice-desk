import { z } from "zod";

export const InvoiceStatusEnum = z.enum([
  "PROCESSING",
  "NEEDS_REVIEW",
  "APPROVED",
  "REJECTED",
]);

export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceAuditLog {
  id: string;
  action: "CREATED" | "STATUS_CHANGED" | "FLAGGED_DUPLICATE" | "NOTE_ADDED";
  fromStatus?: InvoiceStatus;
  toStatus?: InvoiceStatus;
  note?: string;
  actor: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorCategory?: string;
  amount: number;
  currency: string;
  invoiceDate: string; // ISO date string
  dueDate: string;
  status: InvoiceStatus;
  description?: string;
  isDuplicate: boolean;
  duplicateOfInvoiceNumber?: string;
  duplicateReason?: string;
  lineItems: InvoiceLineItem[];
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  auditTrail: InvoiceAuditLog[];
}

export const UpdateInvoiceStatusSchema = z.object({
  status: InvoiceStatusEnum,
  reviewNote: z.string().max(500).optional(),
  reviewedBy: z.string().max(100).optional(),
});

export type UpdateInvoiceStatusInput = z.infer<typeof UpdateInvoiceStatusSchema>;

export interface InvoicesFilterParams {
  status?: InvoiceStatus | "ALL";
  search?: string;
  duplicateOnly?: boolean;
}

export interface InvoicesStats {
  total: number;
  processing: number;
  needsReview: number;
  approved: number;
  rejected: number;
  duplicateCount: number;
  totalPendingAmount: number;
  currency: string;
}
