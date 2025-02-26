import { NextResponse } from "next/server";
import {
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  isAdmin,
} from "@/lib/db-utils";
import { User } from "@/types/user";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const users: User[] = await getAllUsers();

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.error("Users API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
