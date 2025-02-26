// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db-utils";

export async function GET() {
  try {
    const events = await getEvents();
    if (!events) {
      return NextResponse.json(
        { status: 404, data: "No event found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: events });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
