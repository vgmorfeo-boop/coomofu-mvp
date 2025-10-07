// lib/admin.ts
export type AdminRoute = {
  origin: string;
  destination: string;
  duration: string;    // ej: "4h 30m"
  price: number;       // COP por asiento
  startHour: number;   // 0..23
  endHour: number;     // 0..23
  stepMinutes: number; // 15/30/60
};

const KEY = "admin_routes_v1";

export function loadAdminRoutes(): AdminRoute[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdminRoute[]) : [];
  } catch {
    return [];
  }
}

export function saveAdminRoutes(list: AdminRoute[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}
