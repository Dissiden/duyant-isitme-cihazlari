import {
  NextResponse,
} from "next/server";

import {
  ADMIN_COOKIE_NAME,
  getAdminCookieValue,
  hasAdminPassword,
  verifyAdminPassword,
} from "@/lib/admin-auth";


export async function POST(
  request
) {
  try {
    if (
      !hasAdminPassword()
    ) {
      return NextResponse.json(
        {
          error:
            "ADMIN_PASSWORD sunucuda tanımlı değil. Vercel Environment Variables ayarını kontrol edin.",
        },
        {
          status: 500,
        }
      );
    }


    const body =
      await request.json();


    const password =
      String(
        body.password ?? ""
      );


    if (
      !verifyAdminPassword(
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


    const response =
      NextResponse.json({
        success: true,
      });


    response.cookies.set(
      ADMIN_COOKIE_NAME,
      getAdminCookieValue(),
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 *
          60 *
          12,
      }
    );


    return response;

  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Giriş sırasında bir hata oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}