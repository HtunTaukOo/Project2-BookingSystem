import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    await connectDB();

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role
    });

    return NextResponse.json({ message: "User created", user });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}