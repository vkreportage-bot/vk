import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "vk_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export async function createAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function verifyAdminToken(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"]
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
