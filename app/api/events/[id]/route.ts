// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  isAdmin,
} from "@/lib/db-utils";

// Get a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params before using them
    const { id } = params;
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json(
        { status: 404, data: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update an event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params before using them
    const { id } = params;
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { status: 403, data: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const eventData = await request.json();
    const updatedEvent = await updateEvent(id, eventData);

    return NextResponse.json({ status: 200, data: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);

    // Handle Prisma's P2025 error (record not found)
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { status: 404, data: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params before using them
    const { id } = params;
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { status: 403, data: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await deleteEvent(id);

    return NextResponse.json({
      status: 200,
      data: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);

    // Handle Prisma's P2025 error (record not found)
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { status: 404, data: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
