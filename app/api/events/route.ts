// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent, isAdmin } from "@/lib/db-utils";

// Get all events
export async function GET() {
  try {
    const events = await getEvents();
    if (!events || events.length === 0) {
      return NextResponse.json(
        { status: 404, data: "No events found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new event
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { status: 403, data: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const eventData = await request.json();

    // Basic validation
    if (!eventData.name || !eventData.startDate) {
      return NextResponse.json(
        { status: 400, data: "Name and start date are required" },
        { status: 400 }
      );
    }

    const newEvent = await createEvent(eventData);
    return NextResponse.json({ status: 201, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
