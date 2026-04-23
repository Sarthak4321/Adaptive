import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { practiceService } from "@/services/practiceService";

export async function GET() {
  const user = await getSession() as any;
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const question = await practiceService.getNextQuestion(user.sub);
    
    if (!question) {
      return NextResponse.json({ error: "No questions available" }, { status: 404 });
    }

    // Don't leak the correct answer to the frontend during practice
    const { correctAnswer, ...safeQuestion } = question;
    return NextResponse.json(safeQuestion);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
