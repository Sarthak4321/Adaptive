import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { practiceService } from "@/services/practiceService";

export async function POST(req: Request) {
  const user = await getSession() as any;
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId, userAnswer, timeTaken } = await req.json();

    if (!questionId || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attempt = await practiceService.recordAttempt(
      user.sub,
      questionId,
      userAnswer,
      timeTaken
    );

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Record attempt error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
