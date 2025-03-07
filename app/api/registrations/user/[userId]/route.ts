import { getCurrentUser, getUserRegistrations, isAdmin } from "@/lib/db-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const currentUser = await getCurrentUser();

    if (currentUser?.id !== userId && !(await isAdmin())) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const registrations = await getUserRegistrations(userId);

    return NextResponse.json({ status: 200, data: registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
