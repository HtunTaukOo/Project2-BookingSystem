import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import TimeSlot from "@/models/TimeSlot";

export async function POST(req) {
  try {
    const { name, service, date, time, timeSlotId, userEmail } = await req.json();

    await connectDB();

    const appointment = await Appointment.create({
      name,
      service,
      date,
      time,
      userEmail
    });

    // Mark the time slot as booked (unavailable)
    if (timeSlotId) {
      await TimeSlot.findByIdAndUpdate(timeSlotId, { isAvailable: false });
    }

    return NextResponse.json({
      message: "Appointment created",
      appointment
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
