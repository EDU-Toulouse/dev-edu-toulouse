// @/app/api/test/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (session) {
      return NextResponse.json({ status: 200, data: "Success" });
    }

    return NextResponse.json(
      { status: 401, data: "You must be logged in." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
