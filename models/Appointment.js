import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  name: String,
  service: String,
  date: String,
  time: String,
  userEmail: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
