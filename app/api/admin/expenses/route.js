import {
  NextResponse,
} from "next/server";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

import {
  cleanText,
  supabaseRest,
} from "@/lib/supabase-rest";


const CATEGORIES = [
  "Kira",
  "Elektrik",
  "Su",
  "İnternet / Telefon",
  "Personel",
  "Reklam",
  "POS Komisyonu",
  "Sarf Malzeme",
  "Kargo",
  "Vergi / Harç",
  "Bakım / Onarım",
  "Diğer",
];


const PAYMENT_METHODS = [
  "Nakit",
  "Kart",
  "Havale/EFT",
  "Diğer",
];


function unauthorized() {
  return NextResponse.json(
    {
      error:
        "Yetkisiz erişim.",
    },
    {
      status: 401,
    }
  );
}


function isUuid(
  value
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(
      value || ""
    )
  );
}


function validMonth(
  value
) {
  return /^\d{4}-\d{2}$/.test(
    String(
      value || ""
    )
  );
}


function getTurkeyMonth() {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Europe/Istanbul",

        year:
          "numeric",

        month:
          "2-digit",
      }
    ).formatToParts(
      new Date()
    );


  const year =
    parts.find(
      (part) =>
        part.type ===
        "year"
    )?.value;


  const month =
    parts.find(
      (part) =>
        part.type ===
        "month"
    )?.value;


  return `${year}-${month}`;
}


export async function GET(
  request
) {
  if (
    !(await isAdminAuthenticated())
  ) {
    return unauthorized();
  }


  try {
    const url =
      new URL(
        request.url
      );


    const requestedMonth =
      url.searchParams.get(
        "month"
      );


    const month =
      validMonth(
        requestedMonth
      )
        ? requestedMonth
        : getTurkeyMonth();


    const rows =
      await supabaseRest(
        `expenses?select=*&expense_date=gte.${month}-01&expense_date=lt.${getNextMonth(
          month
        )}-01&order=expense_date.desc,created_at.desc&limit=5000`
      );


    return NextResponse.json({
      rows:
        rows || [],
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Giderler alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}


function getNextMonth(
  month
) {
  const [
    year,
    monthNumber,
  ] =
    month
      .split("-")
      .map(Number);


  const date =
    new Date(
      Date.UTC(
        year,
        monthNumber,
        1
      )
    );


  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() +
      1
  ).padStart(
    2,
    "0"
  )}`;
}


function payloadFromData(
  data
) {
  const category =
    cleanText(
      data.category,
      60
    );


  if (
    !CATEGORIES.includes(
      category
    )
  ) {
    throw new Error(
      "Gider kategorisi geçersiz."
    );
  }


  const paymentMethod =
    cleanText(
      data.payment_method,
      40
    );


  if (
    !PAYMENT_METHODS.includes(
      paymentMethod
    )
  ) {
    throw new Error(
      "Ödeme yöntemi geçersiz."
    );
  }


  const amount =
    Number(
      String(
        data.amount ?? ""
      )
        .trim()
        .replace(
          ",",
          "."
        )
    );


  if (
    !Number.isFinite(
      amount
    ) ||
    amount <= 0
  ) {
    throw new Error(
      "Geçerli bir gider tutarı girin."
    );
  }


  if (
    !data.expense_date
  ) {
    throw new Error(
      "Gider tarihi zorunludur."
    );
  }


  return {
    expense_date:
      data.expense_date,

    category,

    amount,

    payment_method:
      paymentMethod,

    description:
      cleanText(
        data.description,
        1500
      ) || null,
  };
}


export async function POST(
  request
) {
  if (
    !(await isAdminAuthenticated())
  ) {
    return unauthorized();
  }


  try {
    const body =
      await request.json();


    const action =
      cleanText(
        body.action ||
          "create",
        30
      );


    const data =
      body.data || {};


    if (
      action ===
      "create"
    ) {
      const payload =
        payloadFromData(
          data
        );


      const rows =
        await supabaseRest(
          "expenses",
          {
            method:
              "POST",

            body:
              payload,

            prefer:
              "return=representation",
          }
        );


      return NextResponse.json(
        {
          row:
            rows?.[0] ||
            null,
        },
        {
          status: 201,
        }
      );
    }


    if (
      action ===
      "update"
    ) {
      const id =
        cleanText(
          data.id,
          80
        );


      if (
        !isUuid(
          id
        )
      ) {
        throw new Error(
          "Gider kaydı geçersiz."
        );
      }


      const payload =
        payloadFromData(
          data
        );


      const rows =
        await supabaseRest(
          `expenses?id=eq.${encodeURIComponent(
            id
          )}`,
          {
            method:
              "PATCH",

            body:
              payload,

            prefer:
              "return=representation",
          }
        );


      return NextResponse.json({
        row:
          rows?.[0] ||
          null,
      });
    }


    if (
      action ===
      "delete"
    ) {
      const id =
        cleanText(
          data.id,
          80
        );


      if (
        !isUuid(
          id
        )
      ) {
        throw new Error(
          "Gider kaydı geçersiz."
        );
      }


      await supabaseRest(
        `expenses?id=eq.${encodeURIComponent(
          id
        )}`,
        {
          method:
            "DELETE",
        }
      );


      return NextResponse.json({
        success: true,
      });
    }


    throw new Error(
      "Geçersiz işlem."
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Gider işlemi başarısız.",
      },
      {
        status: 400,
      }
    );
  }
}