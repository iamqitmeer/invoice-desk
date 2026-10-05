import { NextResponse } from "next/server";
import { resetAndSeedDatabase, getInvoicesStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const seedInvoices = await resetAndSeedDatabase();
    const stats = await getInvoicesStats();

    return NextResponse.json({
      success: true,
      message: "Database successfully reset to initial seed state",
      count: seedInvoices.length,
      stats,
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
