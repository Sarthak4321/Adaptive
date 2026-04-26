import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, name, uid } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email from Google" }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: `google_${uid}_${Math.random().toString(36).slice(-8)}`, // Fallback password
          role: 'STUDENT' // Default role for new signups
        }
      });
    }

    console.log(`Google Login API: Signing JWT for ${user.email} with role ${user.role}`);
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
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Google Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
