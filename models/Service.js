import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  duration: { type: Number, default: 30 }, // in minutes
  price: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
