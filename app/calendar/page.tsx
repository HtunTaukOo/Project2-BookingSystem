"use client";

import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function getWeekDates(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDay(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    // Start from the most recent Monday
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon...
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  useEffect(() => {
    fetch("/api/appointments/list")
      .then((res) => res.json())
      .then((data) => setAppointments(data.appointments || []));
  }, []);

  const days = getWeekDates(weekStart);
  const today = toISODate(new Date());

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    setWeekStart(monday);
  };

  const weekEnd = days[6];
  const weekLabel = `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">{weekLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Today
          </button>
          <button
            onClick={prevWeek}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            ← Prev
          </button>
          <button
            onClick={nextWeek}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const iso = toISODate(day);
          const isToday = iso === today;
          const dayAppts = appointments.filter((a) => a.date === iso);

          return (
            <div
              key={iso}
              className={`rounded-xl border min-h-48 flex flex-col ${
                isToday ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
              }`}
            >
              {/* Day header */}
              <div
                className={`px-3 py-2 border-b text-sm font-semibold rounded-t-xl ${
                  isToday
                    ? "border-blue-200 text-blue-700 bg-blue-100"
                    : "border-gray-100 text-gray-600 bg-gray-50"
                }`}
              >
                {formatDay(day)}
                {dayAppts.length > 0 && (
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    ({dayAppts.length})
                  </span>
                )}
              </div>

              {/* Appointments */}
              <div className="flex flex-col gap-1.5 p-2 flex-1">
                {dayAppts.length === 0 ? (
                  <p className="text-xs text-gray-300 text-center mt-4">—</p>
                ) : (
                  dayAppts.map((a) => (
                    <div
                      key={a._id}
                      className="rounded-lg p-2 bg-white border border-gray-100 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-gray-800 truncate">{a.name}</p>
                      <p className="text-xs text-gray-500 truncate">{a.service}</p>
                      <p className="text-xs text-gray-400">{a.time}</p>
                      <span
                        className={`inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          STATUS_STYLES[a.status] ?? STATUS_STYLES.pending
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily view — all appointments this week */}
      <div className="mt-8 bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">This Week&apos;s Appointments</h2>
        </div>
        {appointments.filter((a) => {
          const iso = a.date;
          return iso >= toISODate(days[0]) && iso <= toISODate(days[6]);
        }).length === 0 ? (
          <p className="text-center text-gray-400 py-10">No appointments this week.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments
              .filter((a) => a.date >= toISODate(days[0]) && a.date <= toISODate(days[6]))
              .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
              .map((a) => (
                <li key={a._id} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.service} · {a.date} · {a.time}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      STATUS_STYLES[a.status] ?? STATUS_STYLES.pending
                    }`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
