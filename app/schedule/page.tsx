"use client";

import { useState } from "react";

export default function SchedulePage() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    if (!name || !service || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          service,
          date,
          time,
          userEmail: "demo@test.com",
        }),
      });

      const data = await res.json();
      alert(data.message);

      setName("");
      setService("");
      setDate("");
      setTime("");

    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Book Appointment</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Service"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />
      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <br /><br />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <br /><br />

      <button onClick={handleBooking}>
        Book Now
      </button>
    </div>
  );
}