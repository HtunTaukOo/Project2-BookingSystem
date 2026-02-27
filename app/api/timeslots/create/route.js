import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function POST(req) {
  try {
    const { date, startTime, endTime } = await req.json();

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: "date, startTime, and endTime are required" }, { status: 400 });
    }

    await connectDB();

    const slot = await TimeSlot.create({ date, startTime, endTime, isAvailable: true });

    return NextResponse.json({ message: "Time slot created", slot });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
