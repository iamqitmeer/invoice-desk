import { NextRequest, NextResponse } from "next/server";
import { getInvoices, getInvoicesStats } from "@/lib/db";
import { InvoiceStatus, InvoicesFilterParams } from "@/types/invoice";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as InvoiceStatus | "ALL" | null;
    const search = searchParams.get("search") || undefined;
    const duplicateOnly = searchParams.get("duplicateOnly") === "true";

    const filterParams: InvoicesFilterParams = {
      status: status && status !== "ALL" ? status : undefined,
      search,
      duplicateOnly,
    };

    const [invoices, stats] = await Promise.all([
      getInvoices(filterParams),
      getInvoicesStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      stats,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoices",
      },
      { status: 500 }
    );
  }
}
