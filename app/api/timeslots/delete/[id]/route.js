import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deleted = await TimeSlot.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Time slot deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
