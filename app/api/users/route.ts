// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/db-utils";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ status: 200, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
