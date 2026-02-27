"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getUser } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/register"];
const ADMIN_ONLY_PATHS: string[] = [];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!isPublic) {
      const user = getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      // Redirect staff away from admin-only pages
      if (user.role !== "admin" && ADMIN_ONLY_PATHS.includes(pathname)) {
        router.replace("/dashboard");
        return;
      }
    }
    setChecked(true);
  }, [pathname, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
