
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName =
      typeof name === "string" ? name.trim() : "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("User");

    // Check whether the email already exists.
    const existingUser = await users.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash the password before storing it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the existing User collection.
    const now = new Date();

    const result = await users.insertOne({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "USER",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("SIGNUP ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
