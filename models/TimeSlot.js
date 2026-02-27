import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },       // e.g. "2026-02-27"
  startTime: { type: String, required: true },  // e.g. "09:00"
  endTime: { type: String, required: true },    // e.g. "09:30"
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.TimeSlot || mongoose.model("TimeSlot", TimeSlotSchema);
