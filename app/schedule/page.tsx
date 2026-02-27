"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/session";

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function SchedulePage() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/services/list")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []));
    fetch("/api/timeslots/list")
      .then((res) => res.json())
      .then((data) => setAllSlots(data.slots || []));
  }, []);

  // Filter available slots for the selected date
  const availableSlots = allSlots.filter(
    (s) => s.date === date && s.isAvailable
  );

  const handleBooking = async () => {
    if (!name || !service || !date || !timeSlotId) {
      alert("Please fill all fields");
      return;
    }

    const selectedSlot = allSlots.find((s) => s._id === timeSlotId);
    const user = getUser();

    setLoading(true);
    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          service,
          date,
          time: selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime}` : "",
          timeSlotId,
          userEmail: user?.email ?? "unknown",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setName("");
        setService("");
        setDate("");
        setTimeSlotId("");
        // Re-fetch slots so booked slot disappears
        const fresh = await fetch("/api/timeslots/list");
        const freshData = await fresh.json();
        setAllSlots(freshData.slots || []);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => s.name === service);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to schedule an appointment</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Appointment booked successfully!
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name} — {s.duration} min / ${s.price}
              </option>
            ))}
          </select>
          {selectedService && (
            <p className="text-xs text-gray-400 mt-1">
              Duration: {selectedService.duration} min · Price: ${selectedService.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => { setDate(e.target.value); setTimeSlotId(""); }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
          {!date ? (
            <p className="text-sm text-gray-400 italic">Select a date first</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-red-400">No available time slots for this date</p>
          ) : (
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeSlotId}
              onChange={(e) => setTimeSlotId(e.target.value)}
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.startTime} – {s.endTime}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  );
}
