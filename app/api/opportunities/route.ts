import { NextResponse } from "next/server";
import { getOpportunities } from "@/lib/arbitrage";

export async function GET() {
  try {
    const data = await getOpportunities();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API /opportunities error:", err);
    return NextResponse.json(
      { error: "Failed to load opportunities" },
      { status: 500 }
    );
  }
}
