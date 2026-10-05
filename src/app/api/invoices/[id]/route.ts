import { NextRequest, NextResponse } from "next/server";
import { getInvoiceById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: `Invoice with ID '${id}' not found` },
        { status: 404 }
      );
    }

    // If it's a duplicate and links to another invoice, optionally fetch the parent invoice for comparison
    let originalInvoice = null;
    if (invoice.isDuplicate && invoice.duplicateOfInvoiceNumber) {
      originalInvoice = await getInvoiceById(invoice.duplicateOfInvoiceNumber);
    }

    return NextResponse.json({
      success: true,
      data: invoice,
      comparison: originalInvoice ? { original: originalInvoice } : undefined,
    });
  } catch (error) {
    console.error("Error retrieving invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve invoice" },
      { status: 500 }
    );
  }
}
