# Mini Invoice Approval Desk — Sledge

A production-grade, full-stack Invoice Approval Desk built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zod**. Designed for financial operations teams to inspect incoming vendor bills, detect duplicate anomalies, and persist approval decisions with audit logs.

---

## 🚀 Key Features

- **Status Navigation & Filtering**: Fast tabs for **Processing**, **Needs Review**, **Approved**, and **Rejected** with real-time count badges.
- **Duplicate Anomaly Detection**: Highlights matching vendor submissions (e.g. duplicate billing statements) with one-click **Side-by-Side Comparison**.
- **Itemized Line Item Inspector**: Detailed breakdown drawer displaying invoice metadata, line items, and audit trail timeline.
- **Persisted Approval & Rejection Flow**: Approve or Reject invoices with optional review notes, instantly persisting decisions to the database.
- **Clean Architecture & REST API**: Strongly typed TypeScript Route Handlers validated with **Zod** schemas.
- **One-Click Seed Reset**: Integrated reset control to instantly restore the 6 sample invoices for testing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Server-side Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom dark fintech aesthetic) |
| **Validation** | [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & ORM** | PostgreSQL / Prisma schema + self-contained auto-persisted storage |

---

## 📊 Database Schema & Status Writeup

### 1. Invoice Status State Machine

```
               [ INGESTION ]
                     │
                     ▼
              [ PROCESSING ]
                     │
            ┌────────┴────────┐
            │                 │
            ▼                 ▼
     [ NEEDS REVIEW ] ──► [ APPROVED ]
            │                 ▲
            ▼                 │
     [ REJECTED ] ────────────┘
```

- **`PROCESSING`**: Newly ingested invoice undergoing automated OCR parsing and rule verification.
- **`NEEDS_REVIEW`**: Flagged by similarity checks (e.g. potential duplicate) or edge usage threshold for human reviewer signoff.
- **`APPROVED`**: Confirmed and cleared for payment disbursement.
- **`REJECTED`**: Declined (e.g. duplicate submission or expired license agreement).

### 2. Schema Definition (`prisma/schema.prisma`)

```prisma
enum InvoiceStatus {
  PROCESSING
  NEEDS_REVIEW
  APPROVED
  REJECTED
}

model Invoice {
  id                       String        @id @default(cuid())
  invoiceNumber            String        @unique
  vendorName               String
  vendorCategory           String?
  amount                   Decimal       @db.Decimal(10, 2)
  currency                 String        @default("USD")
  invoiceDate              DateTime
  dueDate                  DateTime
  status                   InvoiceStatus @default(PROCESSING)
  description              String?
  isDuplicate              Boolean       @default(false)
  duplicateOfInvoiceNumber String?
  duplicateReason          String?
  reviewNote               String?
  reviewedBy               String?
  reviewedAt               DateTime?
  lineItems                Json?         // Structured line items
  auditTrail               Json?         // Audit log entries
  createdAt                DateTime      @default(now())
  updatedAt                DateTime      @updatedAt

  @@index([status])
  @@index([vendorName])
  @@index([isDuplicate])
}
```

---

## 📡 REST API Reference

### 1. List Invoices
- **Endpoint**: `GET /api/invoices`
- **Query Parameters**:
  - `status`: `"ALL" | "PROCESSING" | "NEEDS_REVIEW" | "APPROVED" | "REJECTED"`
  - `search`: string (filters vendor, invoice number, or description)
  - `duplicateOnly`: `"true" | "false"`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_aws_1001",
      "invoiceNumber": "INV-2024-001",
      "vendorName": "AWS Cloud Services",
      "amount": 420.00,
      "currency": "USD",
      "status": "PROCESSING",
      "isDuplicate": false
    }
  ],
  "stats": {
    "total": 6,
    "processing": 2,
    "needsReview": 2,
    "approved": 1,
    "rejected": 1,
    "duplicateCount": 1,
    "totalPendingAmount": 1020.00,
    "currency": "USD"
  }
}
```

---

### 2. Get Single Invoice
- **Endpoint**: `GET /api/invoices/:id`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "inv_aws_1005",
    "invoiceNumber": "INV-2024-005",
    "vendorName": "AWS Cloud Services",
    "amount": 420.00,
    "status": "NEEDS_REVIEW",
    "isDuplicate": true,
    "duplicateOfInvoiceNumber": "INV-2024-001",
    "duplicateReason": "Identical vendor and exact matching amount ($420.00) submitted within 3 days.",
    "lineItems": [...]
  }
}
```

---

### 3. Update Invoice Status
- **Endpoint**: `PATCH /api/invoices/:id/status`
- **Request Body**:
```json
{
  "status": "APPROVED",
  "reviewNote": "Verified against engineering infrastructure budget."
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "inv_aws_1005",
    "status": "APPROVED",
    "reviewNote": "Verified against engineering infrastructure budget.",
    "reviewedAt": "2024-10-06T01:30:00.000Z"
  },
  "message": "Invoice INV-2024-005 status updated to APPROVED"
}
```

---

### 4. Reset & Seed Database
- **Endpoint**: `POST /api/invoices/reset`
- Restores the 6 canonical seed invoices with 1 duplicate.

---

## 🧪 Sample Invoices (Seed Data)

| Invoice # | Vendor | Amount | Initial Status | Notes |
|---|---|---|---|---|
| `INV-2024-001` | AWS Cloud Services | $420.00 | `PROCESSING` | Compute & S3 storage |
| `INV-2024-002` | Vercel Inc. | $180.00 | `NEEDS_REVIEW` | Pro seats + edge overages |
| `INV-2024-003` | Figma Design | $95.00 | `APPROVED` | Team licenses |
| `INV-2024-004` | Linear Software | $120.00 | `REJECTED` | Duplicate workspace subscription |
| `INV-2024-005` | AWS Cloud Services | $420.00 | `NEEDS_REVIEW` | **Duplicate of INV-2024-001** (Triggered anomaly alert) |
| `INV-2024-006` | Slack Technologies | $240.00 | `PROCESSING` | Quarterly Business+ tier |

---

## 💻 Local Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd invoice-desk
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).
