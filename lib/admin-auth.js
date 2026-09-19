import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "duyant_admin_session";

function getSessionToken() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return null;
  }

  return crypto
    .createHmac("sha256", password)
    .update("duyant-admin-session-v1")
    .digest("hex");
}

export function isPasswordValid(candidate) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || typeof candidate !== "string") {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      candidateBuffer,
      expectedBuffer
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const expected = getSessionToken();

  if (!expected) {
    return false;
  }

  const cookieStore = await cookies();

  const actual =
    cookieStore.get(COOKIE_NAME)?.value;

  if (!actual) {
    return false;
  }

  const actualBuffer =
    Buffer.from(actual, "utf8");

  const expectedBuffer =
    Buffer.from(expected, "utf8");

  if (
    actualBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      actualBuffer,
      expectedBuffer
    );
  } catch {
    return false;
  }
}

export function getAdminCookieValue() {
  return getSessionToken();
}

export { COOKIE_NAME };