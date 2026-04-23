import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession() as any;
  if (!user || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorId = user.id || user.sub;
  if (!instructorId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question || question.instructorId !== instructorId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.question.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession() as any;
  if (!user || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorId = user.id || user.sub;
  if (!instructorId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question || question.instructorId !== instructorId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.question.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

