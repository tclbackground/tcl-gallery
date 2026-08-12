import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user in database
    const user = await prisma.user.create({
      data: {
        name: name || "",
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    // Print explicit error in VS Code terminal for debugging
    console.error("SIGNUP ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create account",
        details: String(error),
      },
      { status: 500 }
    );
  }
}