import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME =
  "duyant_admin_session";

const SESSION_MESSAGE =
  "duyant-admin-session-v1";


function getAdminPassword() {
  return String(
    process.env.ADMIN_PASSWORD ?? ""
  ).trim();
}


function safeEqual(
  first,
  second
) {
  const a =
    Buffer.from(
      String(first)
    );

  const b =
    Buffer.from(
      String(second)
    );

  if (
    a.length !==
    b.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    a,
    b
  );
}


export function hasAdminPassword() {
  return (
    getAdminPassword().length >
    0
  );
}


export function verifyAdminPassword(
  password
) {
  const expected =
    getAdminPassword();

  const received =
    String(
      password ?? ""
    ).trim();


  if (!expected) {
    return false;
  }


  return safeEqual(
    received,
    expected
  );
}


export function getAdminCookieValue() {
  const password =
    getAdminPassword();


  if (!password) {
    return "";
  }


  return crypto
    .createHmac(
      "sha256",
      password
    )
    .update(
      SESSION_MESSAGE
    )
    .digest(
      "hex"
    );
}


export async function isAdminAuthenticated() {
  const expected =
    getAdminCookieValue();


  if (!expected) {
    return false;
  }


  const cookieStore =
    await cookies();


  const current =
    cookieStore.get(
      ADMIN_COOKIE_NAME
    )?.value;


  if (!current) {
    return false;
  }


  return safeEqual(
    current,
    expected
  );
}