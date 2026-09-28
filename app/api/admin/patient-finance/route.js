import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

import {
  cleanText,
  supabaseRest,
} from "@/lib/supabase-rest";


const PAYMENT_METHODS = [
  "Nakit",
  "Kart",
  "Havale/EFT",
  "Diğer",
];


function unauthorized() {
  return NextResponse.json(
    {
      error: "Yetkisiz erişim.",
    },
    {
      status: 401,
    }
  );
}


function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}


function nullableText(
  value,
  maxLength = 1000
) {
  const text =
    cleanText(
      value,
      maxLength
    );

  return text || null;
}


function parseMoney(
  value
) {
  return Number(
    String(
      value ?? ""
    )
      .trim()
      .replace(
        ",",
        "."
      )
  );
}


function mapError(
  message
) {
  const value =
    String(
      message || ""
    );


  if (
    value.includes(
      "REASON_REQUIRED"
    )
  ) {
    return "Düzeltme / iptal nedeni zorunludur.";
  }


  if (
    value.includes(
      "PAYMENT_NOT_FOUND"
    )
  ) {
    return "Tahsilat kaydı bulunamadı.";
  }


  if (
    value.includes(
      "PATIENT_NOT_FOUND"
    )
  ) {
    return "Hasta kaydı bulunamadı.";
  }


  if (
    value.includes(
      "INVALID_AMOUNT"
    )
  ) {
    return "Geçerli bir tahsilat tutarı girin.";
  }


  if (
    value.includes(
      "INVALID_COST"
    )
  ) {
    return "Geçerli bir cihaz maliyeti girin.";
  }


  if (
    value.includes(
      "INVALID_PAYMENT_METHOD"
    )
  ) {
    return "Ödeme yöntemi geçersiz.";
  }


  if (
    value.includes(
      "OVERPAYMENT"
    )
  ) {
    return "Yeni tahsilat toplamı satış bedelini aşamaz.";
  }


  return (
    value ||
    "İşlem başarısız."
  );
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


    const patientId =
      cleanText(
        url.searchParams.get(
          "patient_id"
        ),
        80
      );


    if (
      !isUuid(
        patientId
      )
    ) {
      throw new Error(
        "Hasta ID geçersiz."
      );
    }


    const rows =
      await supabaseRest(
        `admin_audit_logs?select=*&patient_id=eq.${encodeURIComponent(
          patientId
        )}&order=created_at.desc&limit=100`
      );


    return NextResponse.json({
      rows:
        rows || [],
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          mapError(
            error.message
          ),
      },
      {
        status: 400,
      }
    );
  }
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
        body.action,
        50
      );


    const data =
      body.data || {};


    if (
      action ===
      "update-payment"
    ) {
      const paymentId =
        cleanText(
          data.id,
          80
        );


      if (
        !isUuid(
          paymentId
        )
      ) {
        throw new Error(
          "Tahsilat ID geçersiz."
        );
      }


      const amount =
        parseMoney(
          data.amount
        );


      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        throw new Error(
          "INVALID_AMOUNT"
        );
      }


      const paymentMethod =
        cleanText(
          data.payment_method,
          30
        );


      if (
        !PAYMENT_METHODS.includes(
          paymentMethod
        )
      ) {
        throw new Error(
          "INVALID_PAYMENT_METHOD"
        );
      }


      const reason =
        cleanText(
          data.reason,
          1000
        );


      if (
        reason.length < 3
      ) {
        throw new Error(
          "REASON_REQUIRED"
        );
      }


      if (
        !data.payment_date
      ) {
        throw new Error(
          "Tahsilat tarihi zorunludur."
        );
      }


      const rows =
        await supabaseRest(
          "rpc/admin_update_payment",
          {
            method: "POST",

            body: {
              p_payment_id:
                paymentId,

              p_amount:
                amount,

              p_payment_date:
                data.payment_date,

              p_payment_method:
                paymentMethod,

              p_note:
                nullableText(
                  data.note,
                  1000
                ),

              p_reason:
                reason,
            },
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
      "delete-payment"
    ) {
      const paymentId =
        cleanText(
          data.id,
          80
        );


      if (
        !isUuid(
          paymentId
        )
      ) {
        throw new Error(
          "Tahsilat ID geçersiz."
        );
      }


      const reason =
        cleanText(
          data.reason,
          1000
        );


      if (
        reason.length < 3
      ) {
        throw new Error(
          "REASON_REQUIRED"
        );
      }


      await supabaseRest(
        "rpc/admin_delete_payment",
        {
          method: "POST",

          body: {
            p_payment_id:
              paymentId,

            p_reason:
              reason,
          },
        }
      );


      return NextResponse.json({
        ok: true,
      });
    }


    if (
      action ===
      "update-cost"
    ) {
      const patientId =
        cleanText(
          data.patient_id,
          80
        );


      if (
        !isUuid(
          patientId
        )
      ) {
        throw new Error(
          "Hasta ID geçersiz."
        );
      }


      const purchaseCost =
        parseMoney(
          data.purchase_cost
        );


      if (
        !Number.isFinite(
          purchaseCost
        ) ||
        purchaseCost < 0
      ) {
        throw new Error(
          "INVALID_COST"
        );
      }


      const reason =
        cleanText(
          data.reason,
          1000
        );


      if (
        reason.length < 3
      ) {
        throw new Error(
          "REASON_REQUIRED"
        );
      }


      const rows =
        await supabaseRest(
          "rpc/admin_update_patient_cost",
          {
            method: "POST",

            body: {
              p_patient_id:
                patientId,

              p_purchase_cost:
                purchaseCost,

              p_reason:
                reason,
            },
          }
        );


      return NextResponse.json({
        row:
          rows?.[0] ||
          null,
      });
    }


    throw new Error(
      "Geçersiz işlem."
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          mapError(
            error.message
          ),
      },
      {
        status: 400,
      }
    );
  }
}