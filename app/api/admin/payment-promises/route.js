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


function istanbulDateString() {
  const parts =
    new Intl.DateTimeFormat(
      "en",
      {
        timeZone:
          "Europe/Istanbul",
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      }
    ).formatToParts(
      new Date()
    );


  const values =
    Object.fromEntries(
      parts.map(
        (part) => [
          part.type,
          part.value,
        ]
      )
    );


  return `${values.year}-${values.month}-${values.day}`;
}


async function getPatient(
  patientId
) {
  const rows =
    await supabaseRest(
      `patients?select=id,full_name,phone,tc_identity,sale_price&id=eq.${encodeURIComponent(
        patientId
      )}&limit=1`
    );


  return (
    rows?.[0] ||
    null
  );
}


async function getPromise(
  id
) {
  const rows =
    await supabaseRest(
      `payment_promises?select=*&id=eq.${encodeURIComponent(
        id
      )}&limit=1`
    );


  return (
    rows?.[0] ||
    null
  );
}


async function getPatientPromises(
  patientId
) {
  return (
    await supabaseRest(
      `payment_promises?select=*&patient_id=eq.${encodeURIComponent(
        patientId
      )}&order=due_date.asc,created_at.asc`
    )
  ) || [];
}


async function getPatientPaidTotal(
  patientId
) {
  const rows =
    (
      await supabaseRest(
        `payments?select=amount&patient_id=eq.${encodeURIComponent(
          patientId
        )}`
      )
    ) || [];


  return rows.reduce(
    (
      sum,
      row
    ) =>
      sum +
      Number(
        row.amount ||
          0
      ),
    0
  );
}


async function getPlanningContext(
  patientId,
  excludePromiseId = ""
) {
  const [
    patient,
    promises,
    paidTotal,
  ] =
    await Promise.all([
      getPatient(
        patientId
      ),

      getPatientPromises(
        patientId
      ),

      getPatientPaidTotal(
        patientId
      ),
    ]);


  if (!patient) {
    throw new Error(
      "Hasta bulunamadı."
    );
  }


  const salePrice =
    Number(
      patient.sale_price ||
        0
    );


  const remaining =
    Math.max(
      salePrice -
        paidTotal,
      0
    );


  const planned =
    promises.reduce(
      (
        sum,
        row
      ) => {
        if (
          row.status !==
            "Bekliyor" ||
          row.id ===
            excludePromiseId
        ) {
          return sum;
        }


        return (
          sum +
          Number(
            row.amount ||
              0
          )
        );
      },
      0
    );


  return {
    patient,
    salePrice,
    paidTotal,
    remaining,
    planned,
    available:
      Math.max(
        remaining -
          planned,
        0
      ),
  };
}


async function attachPatients(
  rows
) {
  const patientIds =
    [
      ...new Set(
        rows
          .map(
            (row) =>
              row.patient_id
          )
          .filter(
            Boolean
          )
      ),
    ];


  if (
    patientIds.length ===
    0
  ) {
    return [];
  }


  const patients =
    await Promise.all(
      patientIds.map(
        (patientId) =>
          getPatient(
            patientId
          )
      )
    );


  const patientMap =
    new Map(
      patients
        .filter(
          Boolean
        )
        .map(
          (patient) => [
            patient.id,
            patient,
          ]
        )
    );


  return rows.map(
    (row) => ({
      ...row,

      patient:
        patientMap.get(
          row.patient_id
        ) || null,
    })
  );
}


export async function GET(
  request
) {
  if (
    !(
      await isAdminAuthenticated()
    )
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


    const scope =
      cleanText(
        url.searchParams.get(
          "scope"
        ),
        30
      );


    if (
      patientId
    ) {
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
        await getPatientPromises(
          patientId
        );


      return NextResponse.json({
        rows,
      });
    }


    if (
      scope ===
      "dashboard"
    ) {
      const today =
        istanbulDateString();


      const [
        todayBase,
        overdueBase,
      ] =
        await Promise.all([
          supabaseRest(
            `payment_promises?select=*&status=eq.Bekliyor&due_date=eq.${today}&order=created_at.asc`
          ),

          supabaseRest(
            `payment_promises?select=*&status=eq.Bekliyor&due_date=lt.${today}&order=due_date.asc,created_at.asc`
          ),
        ]);


      const [
        todayRows,
        overdueRows,
      ] =
        await Promise.all([
          attachPatients(
            todayBase ||
              []
          ),

          attachPatients(
            overdueBase ||
              []
          ),
        ]);


      const todayAmount =
        todayRows.reduce(
          (
            sum,
            row
          ) =>
            sum +
            Number(
              row.amount ||
                0
            ),
          0
        );


      const overdueAmount =
        overdueRows.reduce(
          (
            sum,
            row
          ) =>
            sum +
            Number(
              row.amount ||
                0
            ),
          0
        );


      return NextResponse.json({
        today:
          todayRows,

        overdue:
          overdueRows,

        totals: {
          todayCount:
            todayRows.length,

          todayAmount,

          overdueCount:
            overdueRows.length,

          overdueAmount,
        },
      });
    }


    throw new Error(
      "Geçersiz istek."
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Ödeme planları alınamadı.",
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
    !(
      await isAdminAuthenticated()
    )
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
          "Hasta seçimi geçersiz."
        );
      }


      if (
        !data.due_date
      ) {
        throw new Error(
          "Ödeme tarihi zorunludur."
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
          "Geçerli bir ödeme tutarı girin."
        );
      }


      const context =
        await getPlanningContext(
          patientId
        );


      if (
        amount >
        context.available +
          0.01
      ) {
        throw new Error(
          `Planlanabilir kalan tutar ${context.available} TL.`
        );
      }


      const rows =
        await supabaseRest(
          "payment_promises",
          {
            method:
              "POST",

            body: {
              patient_id:
                patientId,

              due_date:
                data.due_date,

              amount,

              status:
                "Bekliyor",

              note:
                nullableText(
                  data.note,
                  1000
                ),
            },

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
          "Ödeme planı ID geçersiz."
        );
      }


      const current =
        await getPromise(
          id
        );


      if (
        !current
      ) {
        throw new Error(
          "Ödeme planı bulunamadı."
        );
      }


      if (
        current.status !==
        "Bekliyor"
      ) {
        throw new Error(
          "Yalnızca bekleyen ödeme planları düzenlenebilir."
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
          "Geçerli bir ödeme tutarı girin."
        );
      }


      if (
        !data.due_date
      ) {
        throw new Error(
          "Ödeme tarihi zorunludur."
        );
      }


      const context =
        await getPlanningContext(
          current.patient_id,
          current.id
        );


      if (
        amount >
        context.available +
          0.01
      ) {
        throw new Error(
          `Planlanabilir kalan tutar ${context.available} TL.`
        );
      }


      const rows =
        await supabaseRest(
          `payment_promises?id=eq.${encodeURIComponent(
            id
          )}`,
          {
            method:
              "PATCH",

            body: {
              due_date:
                data.due_date,

              amount,

              note:
                nullableText(
                  data.note,
                  1000
                ),
            },

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
      "cancel"
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
          "Ödeme planı ID geçersiz."
        );
      }


      const current =
        await getPromise(
          id
        );


      if (
        !current
      ) {
        throw new Error(
          "Ödeme planı bulunamadı."
        );
      }


      if (
        current.status !==
        "Bekliyor"
      ) {
        throw new Error(
          "Yalnızca bekleyen ödeme planları iptal edilebilir."
        );
      }


      const rows =
        await supabaseRest(
          `payment_promises?id=eq.${encodeURIComponent(
            id
          )}`,
          {
            method:
              "PATCH",

            body: {
              status:
                "İptal",

              completed_at:
                null,
            },

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
      "collect"
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
          "Ödeme planı ID geçersiz."
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
          "Ödeme yöntemi geçersiz."
        );
      }


      const rows =
        await supabaseRest(
          "rpc/admin_collect_payment_promise",
          {
            method:
              "POST",

            body: {
              p_promise_id:
                id,

              p_payment_date:
                data.payment_date ||
                istanbulDateString(),

              p_payment_method:
                paymentMethod,

              p_note:
                nullableText(
                  data.note,
                  1000
                ),
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
    const message =
      String(
        error.message ||
          "İşlem başarısız."
      );


    let mapped =
      message;


    if (
      message.includes(
        "PROMISE_NOT_FOUND"
      )
    ) {
      mapped =
        "Ödeme planı bulunamadı.";
    }


    if (
      message.includes(
        "PROMISE_NOT_OPEN"
      )
    ) {
      mapped =
        "Bu ödeme planı artık bekleyen durumda değil.";
    }


    if (
      message.includes(
        "OVERPAYMENT"
      )
    ) {
      mapped =
        "Bu tahsilat satış bedelini aşacağı için kaydedilemez.";
    }


    if (
      message.includes(
        "INVALID_PAYMENT_METHOD"
      )
    ) {
      mapped =
        "Ödeme yöntemi geçersiz.";
    }


    return NextResponse.json(
      {
        error:
          mapped,
      },
      {
        status: 400,
      }
    );
  }
}
