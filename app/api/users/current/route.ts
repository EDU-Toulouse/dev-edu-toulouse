// @/app/api/users/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/db-utils";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "No Current User Found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: currentUser }, { status: 200 });
  } catch (error) {
    console.error("User Current API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
