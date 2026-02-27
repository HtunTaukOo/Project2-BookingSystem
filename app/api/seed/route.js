import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Service from "@/models/Service";
import TimeSlot from "@/models/TimeSlot";
import Appointment from "@/models/Appointment";

export async function POST() {
  return NextResponse.json({ error: "Seed endpoint is disabled" }, { status: 404 });

  // eslint-disable-next-line no-unreachable
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      TimeSlot.deleteMany({}),
      Appointment.deleteMany({}),
    ]);

    // Users
    await User.insertMany([
      { name: "Admin User", email: "admin@queueease.com", password: "admin123", role: "admin" },
      { name: "Staff Alice", email: "alice@queueease.com", password: "staff123", role: "staff" },
    ]);

    // Services
    const services = await Service.insertMany([
      { name: "Haircut", description: "Basic haircut and styling", duration: 30, price: 15 },
      { name: "Hair Coloring", description: "Full hair coloring with premium dye", duration: 90, price: 60 },
      { name: "Beard Trim", description: "Beard shaping and trimming", duration: 20, price: 10 },
      { name: "Deep Conditioning", description: "Moisturizing hair treatment", duration: 45, price: 25 },
    ]);

    // Time Slots (next 3 days)
    const today = new Date();
    const slots = [];
    for (let d = 0; d < 3; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().split("T")[0];

      const times = [
        ["09:00", "09:30"],
        ["09:30", "10:00"],
        ["10:00", "10:30"],
        ["10:30", "11:00"],
        ["11:00", "11:30"],
        ["13:00", "13:30"],
        ["14:00", "14:30"],
        ["15:00", "15:30"],
      ];

      for (const [start, end] of times) {
        slots.push({ date: dateStr, startTime: start, endTime: end, isAvailable: true });
      }
    }
    // Mark a few as unavailable
    slots[2].isAvailable = false;
    slots[5].isAvailable = false;
    await TimeSlot.insertMany(slots);

    // Appointments
    const dateStr0 = today.toISOString().split("T")[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateStr1 = tomorrow.toISOString().split("T")[0];

    await Appointment.insertMany([
      { name: "John Smith", service: services[0].name, date: dateStr0, time: "09:00", userEmail: "john@example.com" },
      { name: "Emma Wilson", service: services[1].name, date: dateStr0, time: "10:00", userEmail: "emma@example.com" },
      { name: "Liam Brown", service: services[2].name, date: dateStr0, time: "11:00", userEmail: "liam@example.com" },
      { name: "Sophia Lee", service: services[3].name, date: dateStr1, time: "09:30", userEmail: "sophia@example.com" },
      { name: "Noah Kim", service: services[0].name, date: dateStr1, time: "13:00", userEmail: "noah@example.com" },
    ]);

    return NextResponse.json({
      message: "Seed successful",
      summary: {
        users: 2,
        services: services.length,
        timeSlots: slots.length,
        appointments: 5,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
