import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    const updated = await TimeSlot.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Time slot updated", updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
