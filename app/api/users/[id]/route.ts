// @/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
  isAdmin,
  getCurrentUser,
} from "@/lib/db-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!(await isAdmin()) && currentUser?.id !== id) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json(
        { status: 404, data: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role } = body;
    if (!name && !email) {
      return NextResponse.json(
        {
          status: 400,
          data: "At least one field (name or email) must be provided",
        },
        { status: 400 }
      );
    }
    const updatedUser = await updateUser(id, { name, email, role });
    return NextResponse.json({ status: 200, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedUser = await deleteUser(id);
    return NextResponse.json({ status: 200, data: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: 500, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
