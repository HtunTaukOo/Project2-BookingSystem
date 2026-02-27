"use client";

import { useEffect, useState } from "react";

interface Appointment {
  _id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  userEmail: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchAppointments = async () => {
    const res = await fetch("/api/appointments/list");
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  useEffect(() => {
    fetch("/api/appointments/list")
      .then((res) => res.json())
      .then((data) => setAppointments(data.appointments || []));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`/api/appointments/delete/${id}`, { method: "DELETE" });
    fetchAppointments();
  };

  const handleEdit = (a: any) => {
    setEditingId(a._id);
    setNewService(a.service);
    setNewTime(a.time);
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/appointments/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: newService, time: newTime }),
    });
    setEditingId(null);
    fetchAppointments();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">All upcoming appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {appointments.filter((a) => a.date === today).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {appointments.filter((a) => a.date >= today).length}
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Appointments ({appointments.length})</h2>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No appointments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map((a: any) => (
              <li key={a._id} className="px-6 py-4">
                {editingId === a._id ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                    <input
                      type="time"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate(a._id)}
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
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{a.name}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-0.5">
                        <span>{a.service}</span>
                        <span>{a.date}</span>
                        <span>{a.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
