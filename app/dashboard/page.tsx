"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch("/api/appointments/list");
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/appointments/delete/${id}`, {
      method: "DELETE",
    });
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: newService,
        time: newTime,
      }),
    });

    setEditingId(null);
    fetchAppointments();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Appointments Dashboard</h1>

      {appointments.map((a: any) => (
        <div
          key={a._id}
          style={{
            marginBottom: 20,
            borderBottom: "1px solid gray",
            paddingBottom: 10,
          }}
        >
          <p>Name: {a.name}</p>

          {editingId === a._id ? (
            <>
              <input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
              />
              <input
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <button onClick={() => handleUpdate(a._id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <p>Service: {a.service}</p>
              <p>Time: {a.time}</p>
              <button onClick={() => handleEdit(a)}>Edit</button>
            </>
          )}

          <p>Date: {a.date}</p>

          <button onClick={() => handleDelete(a._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}