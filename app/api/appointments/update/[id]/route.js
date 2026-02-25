import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await Appointment.findByIdAndUpdate(
      new mongoose.Types.ObjectId(params.id),
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Appointment updated",
      updated
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}