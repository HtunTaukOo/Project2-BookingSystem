"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/session";

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function TimeSlotsPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: "", startTime: "", endTime: "", isAvailable: true });
  const [loading, setLoading] = useState(false);
  const isAdmin = getUser()?.role === "admin";

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const res = await fetch("/api/timeslots/list");
    const data = await res.json();
    setSlots(data.slots || []);
  };

  const handleCreate = async () => {
    if (!form.date || !form.startTime || !form.endTime) return alert("All fields are required");
    setLoading(true);
    await fetch("/api/timeslots/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ date: "", startTime: "", endTime: "" });
    await fetchSlots();
    setLoading(false);
  };

  const handleEdit = (s: TimeSlot) => {
    setEditingId(s._id);
    setEditForm({ date: s.date, startTime: s.startTime, endTime: s.endTime, isAvailable: s.isAvailable });
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/timeslots/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchSlots();
  };

  const toggleAvailability = async (s: TimeSlot) => {
    await fetch(`/api/timeslots/update/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !s.isAvailable }),
    });
    fetchSlots();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this time slot?")) return;
    await fetch(`/api/timeslots/delete/${id}`, { method: "DELETE" });
    fetchSlots();
  };

  const grouped = slots.reduce<Record<string, TimeSlot[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Time Slot Management" : "Available Time Slots"}
        </h1>
        {!isAdmin && (
          <p className="text-sm text-gray-500 mt-1">View-only — contact an admin to make changes</p>
        )}
      </div>

      {/* Add Time Slot Form — Admin only */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Time Slot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Time Slot"}
          </button>
        </div>
      )}

      {/* Slots grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          No time slots yet.
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateSlots]) => (
          <div key={date} className="bg-white rounded-xl shadow mb-4">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700">{date}</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {dateSlots.map((s) => (
                <li key={s._id} className="px-6 py-3">
                  {editingId === s._id ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                      <input
                        type="time"
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                      />
                      <input
                        type="time"
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                      />
                      <div className="flex gap-2 md:col-span-3">
                        <button
                          onClick={() => handleUpdate(s._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-800">
                          {s.startTime} – {s.endTime}
                        </span>
                        {/* Both admin and staff can toggle availability */}
                        <button
                          onClick={() => toggleAvailability(s)}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                            s.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {s.isAvailable ? "Available" : "Unavailable"}
                        </button>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
