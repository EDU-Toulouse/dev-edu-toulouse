// app/api/registrations/event/[eventId]/route.ts
import { getEventRegistrations, isAdmin } from "@/lib/db-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const registrations = await getEventRegistrations(eventId);

    return NextResponse.json({ status: 200, data: registrations.length });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
