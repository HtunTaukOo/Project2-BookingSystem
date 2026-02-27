import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json({ message: "Services fetched", services });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
