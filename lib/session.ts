const SESSION_KEY = "queueease_user";

export interface SessionUser {
  name: string;
  email: string;
  role: "admin" | "staff";
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(SESSION_KEY);
}
