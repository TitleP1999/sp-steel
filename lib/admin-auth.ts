import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sp-steel-admin";
export const SESSION_SECONDS = 60 * 60 * 8;
export function authConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH || "") && (process.env.ADMIN_SESSION_SECRET?.length || 0) >= 32);
}
function signature(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD_HASH}:${value}`).digest("hex");
}
export function createSession() {
  if (!authConfigured()) throw new Error("Admin is not configured");
  const value = `${Date.now() + SESSION_SECONDS * 1000}.${randomBytes(24).toString("hex")}`;
  return `${value}.${signature(value)}`;
}
export function verifySession(token?: string) {
  if (!authConfigured() || !token || token.length > 200) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{48}$/.test(parts[1]) || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
  const expiry = Number(parts[0]);
  return expiry > Date.now() && expiry <= Date.now() + SESSION_SECONDS * 1000 && timingSafeEqual(Buffer.from(parts[2], "hex"), Buffer.from(signature(`${parts[0]}.${parts[1]}`), "hex"));
}

// One bounded account-wide limiter; do not trust client-supplied forwarding headers.
const state = globalThis as typeof globalThis & { adminAttempts?: { count: number; until: number } };
export async function checkCredentials(username: string, password: string): Promise<"ok" | "invalid" | "limited"> {
  if (!authConfigured()) return "invalid";
  const now = Date.now();
  if (!state.adminAttempts || state.adminAttempts.until <= now) state.adminAttempts = { count: 0, until: now + 15 * 60 * 1000 };
  if (state.adminAttempts.count >= 10) return "limited";
  state.adminAttempts.count++;
  if (username.length > 100 || password.length > 1024) return "invalid";
  const [salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  const actual = await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)));
  const valid = timingSafeEqual(actual, Buffer.from(hash, "hex")) && username === process.env.ADMIN_USERNAME;
  if (valid) state.adminAttempts.count = 0;
  return valid ? "ok" : "invalid";
}
