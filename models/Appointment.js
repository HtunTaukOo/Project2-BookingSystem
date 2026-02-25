import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  name: String,
  service: String,
  date: String,
  time: String,
  userEmail: String
}, { timestamps: true });   

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);