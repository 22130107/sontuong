/**
 * Simple client-side admin auth.
 * For production: replace with NextAuth.js or similar.
 */

const AUTH_KEY = "nasun_admin_auth";
// Change these credentials before deploying!
const ADMIN_USER = "admin";
const ADMIN_PASS = "nasun2024";

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "1";
}
