import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    const updated = await Service.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service updated", updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
