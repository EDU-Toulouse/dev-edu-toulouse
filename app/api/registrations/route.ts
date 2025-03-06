// app/api/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRegistrations, createRegistration, isAdmin } from "@/lib/db-utils";

// Get all events
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const registrations = await getRegistrations();
    if (!registrations || registrations.length === 0) {
      return NextResponse.json(
        { status: 404, data: "No registrations found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 200, data: registrations });
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
    const registrationData = await request.json();

    console.log(registrationData);

    // Basic validation
    if (!registrationData.userId || !registrationData.eventId) {
      return NextResponse.json(
        { status: 400, data: "User ID and Event ID are required" },
        { status: 400 }
      );
    }

    const newRegistration = await createRegistration(registrationData);
    return NextResponse.json(
      { status: 201, data: newRegistration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
