import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function POST(req) {
  try {
    const { name, description, duration, price } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Service name is required" }, { status: 400 });
    }

    await connectDB();

    const service = await Service.create({ name, description, duration, price });

    return NextResponse.json({ message: "Service created", service });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
