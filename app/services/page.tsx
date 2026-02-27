"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/session";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", duration: 30, price: 0 });
  const [editForm, setEditForm] = useState({ name: "", description: "", duration: 30, price: 0 });
  const [loading, setLoading] = useState(false);
  const isAdmin = getUser()?.role === "admin";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services/list");
    const data = await res.json();
    setServices(data.services || []);
  };

  const handleCreate = async () => {
    if (!form.name) return alert("Service name is required");
    setLoading(true);
    await fetch("/api/services/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", duration: 30, price: 0 });
    await fetchServices();
    setLoading(false);
  };

  const handleEdit = (s: Service) => {
    setEditingId(s._id);
    setEditForm({ name: s.name, description: s.description, duration: s.duration, price: s.price });
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/services/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/delete/${id}`, { method: "DELETE" });
    fetchServices();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Service Management" : "Available Services"}
        </h1>
        {!isAdmin && (
          <p className="text-sm text-gray-500 mt-1">View-only — contact an admin to make changes</p>
        )}
      </div>

      {/* Add Service Form — Admin only */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Service name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Duration (min)</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 w-24">Price ($)</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      )}

      {/* Service List */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">All Services ({services.length})</h2>
        </div>

        {services.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No services yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {services.map((s) => (
              <li key={s._id} className="px-6 py-4">
                {editingId === s._id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    />
                    <div className="flex gap-2 md:col-span-2">
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
                    <div>
                      <p className="font-semibold text-gray-800">{s.name}</p>
                      {s.description && <p className="text-sm text-gray-500">{s.description}</p>}
                      <div className="flex gap-4 mt-1 text-sm text-gray-400">
                        <span>{s.duration} min</span>
                        <span>${s.price}</span>
                      </div>
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
        )}
      </div>
    </div>
  );
}
