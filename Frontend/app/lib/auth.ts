export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const TOKEN_KEY = "Selah_access_token";

/** Access token persisted in localStorage so it survives reloads. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export interface Wallet {
  id: string;
  publicKey: string;
  isPrimary: boolean;
  lastUsed: string | null;
}

export interface User {
  id: string;
  email: string | null;
  username: string | null;
  isActive: boolean;
  createdAt: string;
  wallets: Wallet[];
}

/**
 * Fetch the currently authenticated user from `GET /auth/me`.
 *
 * The backend wraps every successful response in the standard envelope
 * `{ success, statusCode, data, timestamp, path }` (see
 * `ResponseEnvelopeInterceptor`), so we read `body.data`. We fall back to
 * the raw body in case the envelope is ever absent.
 */
export async function fetchCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json()) as { message?: string };
    throw new Error(
      body?.message || `Failed to load user profile (${response.status})`,
    );
  }

  const body = (await response.json()) as {
    data?: unknown;
    [key: string]: unknown;
  };
  const data = body?.data ?? body;
  return data as User;
}
