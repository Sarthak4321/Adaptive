import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { practiceService } from "@/services/practiceService";

export async function GET() {
  const user = await getSession() as any;
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id || user.sub;
  if (!userId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const stats = await practiceService.getStudentStats(userId);
    return NextResponse.json(stats);

  } catch (error) {
    console.error("Get student stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
