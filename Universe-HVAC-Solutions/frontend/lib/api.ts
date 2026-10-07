const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "uhvac_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;
  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Thin wrapper around fetch() that always targets the backend API, adds
 * the admin bearer token when one is stored (harmless to send on public
 * endpoints — they simply ignore it), and turns non-2xx responses into a
 * typed ApiError instead of silently returning bad data.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const token = getAdminToken();

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined)
  };
  if (token && auth !== false) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders, cache: "no-store" });
  } catch {
    throw new ApiError("Could not reach the server. Please check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || "Something went wrong. Please try again.", res.status, data.details);
  }

  return data as T;
}

export { API_BASE };
