// @/app/api/users/current/route.ts
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

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
