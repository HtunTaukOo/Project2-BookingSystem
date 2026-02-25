import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET() {
  try {
    await connectDB();

    const appointments = await Appointment.find().sort({ createdAt: -1 });

    return NextResponse.json({
      message: "Appointments fetched",
      appointments
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}