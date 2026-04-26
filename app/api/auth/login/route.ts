import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/services/authService";
import { signJWT } from "@/lib/auth";
// Triggering re-evaluation

 
export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "Please use POST request to login." },
    { status: 405 }
  );
}


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await authService.comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log(`Login API: Signing JWT for ${user.email} with role ${user.role}`);
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    const response = NextResponse.json({ 
      user: { id: user.id, email: user.email, role: user.role },
      token 
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
