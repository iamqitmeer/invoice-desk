import { NextRequest, NextResponse } from "next/server";
import { updateInvoiceStatus } from "@/lib/db";
import { UpdateInvoiceStatusSchema } from "@/types/invoice";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
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

    const body = await request.json();
    const validationResult = UpdateInvoiceStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: validationResult.error.flatten(),
        },
        { status: 422 }
      );
    }

    const { status, reviewNote, reviewedBy } = validationResult.data;

    const updatedInvoice = await updateInvoiceStatus(
      id,
      status,
      reviewNote,
      reviewedBy || "Reviewer"
    );

    if (!updatedInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: `Invoice with ID '${id}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedInvoice,
      message: `Invoice ${updatedInvoice.invoiceNumber} status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update invoice status",
      },
      { status: 500 }
    );
  }
}
