import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession() as any;
  if (!user || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorId = user.id || user.sub;
  if (!instructorId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { instructorId: instructorId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const user = await getSession() as any;
  if (!user || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorId = user.id || user.sub;
  if (!instructorId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Bulk Creation Support
    if (Array.isArray(body)) {
      const created = await prisma.question.createMany({
        data: body.map(q => ({
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
          instructorId: instructorId
        }))
      });
      return NextResponse.json({ count: created.count });
    }

    const { text, options, correctAnswer, difficulty } = body;
    
    if (!text || !options || !correctAnswer || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        text,
        options,
        correctAnswer,
        difficulty,
        instructorId: instructorId
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


