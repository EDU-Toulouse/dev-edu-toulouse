// app/api/registration/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  isAdmin,
  getRegistrationById,
  getCurrentUser,
  deleteRegistration,
} from "@/lib/db-utils";

// Get a specific registration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Await the params before using them
    const { id } = params;
    const registration = await getRegistrationById(id);
    if (!registration) {
      return NextResponse.json(
        { status: 404, data: "Registration not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: registration });
  } catch (error) {
    console.error("Error fetching event:", error);
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
    const currentUser = await getCurrentUser();
    const { id } = params;

    const concernedRegistration = await getRegistrationById(id);
    if (
      concernedRegistration?.userId !== currentUser?.id &&
      !(await isAdmin())
    ) {
      return NextResponse.json(
        { message: "Forbidden: You're not the registration owner" },
        { status: 403 }
      );
    }

    await deleteRegistration(id);

    return NextResponse.json({
      status: 200,
      data: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);

    // Handle Prisma's P2025 error (record not found)
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json(
        { status: 404, data: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
