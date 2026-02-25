import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(req) {
  try {
    const { name, service, date, time, userEmail } = await req.json();

    await connectDB();

    const appointment = await Appointment.create({
      name,
      service,
      date,
      time,
      userEmail
    });

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