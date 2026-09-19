import {
  NextResponse,
} from "next/server";

import {
  COOKIE_NAME,
  getAdminCookieValue,
  isPasswordValid,
} from "@/lib/admin-auth";

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const password =
      String(
        body?.password || ""
      );

    if (
      !isPasswordValid(
        password
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Şifre hatalı.",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      getAdminCookieValue();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "ADMIN_PASSWORD tanımlı değil.",
        },
        {
          status: 500,
        }
      );
    }

    const response =
      NextResponse.json({
        ok: true,
      });

    response.cookies.set(
      COOKIE_NAME,
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 12,
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        error:
          "Giriş işlemi tamamlanamadı.",
      },
      {
        status: 500,
      }
    );
  }
}