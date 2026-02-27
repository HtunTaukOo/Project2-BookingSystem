"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearUser, SessionUser } from "@/lib/session";

const allNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", adminOnly: false },
  { href: "/calendar", label: "Weekly Schedule", icon: "🗓️", adminOnly: false },
  { href: "/services", label: "Services", icon: "🛠️", adminOnly: false },
  { href: "/timeslots", label: "Time Slots", icon: "🕐", adminOnly: false },
  { href: "/schedule", label: "Book Appointment", icon: "📅", adminOnly: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearUser();
    router.replace("/login");
  };

  const navItems = allNavItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <aside className="w-56 bg-white shadow-md flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">QueueEase</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {user?.role === "admin" ? "Admin Panel" : "Staff Panel"}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        {user && (
          <div className="px-2">
            <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition font-medium"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
