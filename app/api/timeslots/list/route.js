import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function GET() {
  try {
    await connectDB();

    const slots = await TimeSlot.find().sort({ date: 1, startTime: 1 });

    return NextResponse.json({ message: "Time slots fetched", slots });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
