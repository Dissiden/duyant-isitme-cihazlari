import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

import {
  cleanText,
  supabaseRest,
} from "@/lib/supabase-rest";


const APPOINTMENT_TYPES = [
  "Kontrol",
  "Ayar",
  "Bakım",
  "Teslim",
  "Telefon Görüşmesi",
  "Diğer",
];


const APPOINTMENT_STATUSES = [
  "Planlandı",
  "Tamamlandı",
  "İptal",
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


function includesText(
  value,
  query
) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .includes(
      String(query || "")
        .toLocaleLowerCase("tr-TR")
    );
}


function isSameDay(
  value,
  date
) {
  const target =
    new Date(value);

  if (
    Number.isNaN(
      target.getTime()
    )
  ) {
    return false;
  }

  return (
    target.getFullYear() ===
      date.getFullYear() &&
    target.getMonth() ===
      date.getMonth() &&
    target.getDate() ===
      date.getDate()
  );
}


async function getRows() {
  const [
    appointments,
    patients,
  ] =
    await Promise.all([
      supabaseRest(
        "appointments?select=*&order=appointment_at.asc&limit=2000"
      ),

      supabaseRest(
        "patients?select=id,full_name,tc_identity,phone,device_name&limit=2000"
      ),
    ]);


  const patientMap =
    new Map(
      (patients || []).map(
        (patient) => [
          patient.id,
          patient,
        ]
      )
    );


  return (
    appointments || []
  ).map(
    (appointment) => {

      const patient =
        patientMap.get(
          appointment.patient_id
        ) || null;


      return {
        ...appointment,

        patient: patient
          ? {
              id:
                patient.id,

              full_name:
                patient.full_name,

              tc_identity:
                patient.tc_identity,

              phone:
                patient.phone,

              device_name:
                patient.device_name,
            }
          : null,
      };
    }
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


    const range =
      cleanText(
        url.searchParams.get(
          "range"
        ) || "all",
        30
      );


    const search =
      cleanText(
        url.searchParams.get(
          "q"
        ),
        160
      );


    let rows =
      await getRows();


    const now =
      new Date();


    if (
      range ===
      "today"
    ) {
      rows =
        rows.filter(
          (row) =>
            row.status ===
              "Planlandı" &&
            isSameDay(
              row.appointment_at,
              now
            )
        );
    }


    if (
      range ===
      "upcoming"
    ) {
      rows =
        rows.filter(
          (row) =>
            row.status ===
              "Planlandı" &&
            new Date(
              row.appointment_at
            ) >= now
        );
    }


    if (
      range ===
      "completed"
    ) {
      rows =
        rows.filter(
          (row) =>
            row.status ===
            "Tamamlandı"
        );
    }


    if (
      range ===
      "cancelled"
    ) {
      rows =
        rows.filter(
          (row) =>
            row.status ===
            "İptal"
        );
    }


    if (search) {
      rows =
        rows.filter(
          (row) =>
            includesText(
              row.patient?.full_name,
              search
            ) ||

            includesText(
              row.patient?.tc_identity,
              search
            ) ||

            includesText(
              row.patient?.phone,
              search
            ) ||

            includesText(
              row.patient?.device_name,
              search
            ) ||

            includesText(
              row.appointment_type,
              search
            ) ||

            includesText(
              row.status,
              search
            ) ||

            includesText(
              row.notes,
              search
            )
        );
    }


    if (
      range ===
        "completed" ||
      range ===
        "cancelled"
    ) {
      rows.sort(
        (a, b) =>
          new Date(
            b.appointment_at
          ) -
          new Date(
            a.appointment_at
          )
      );
    }


    return NextResponse.json({
      rows,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Randevular alınamadı.",
      },
      {
        status: 500,
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
          "Hasta seçmelisiniz."
        );
      }


      if (
        !data.appointment_at
      ) {
        throw new Error(
          "Randevu tarihi ve saati zorunludur."
        );
      }


      const date =
        new Date(
          data.appointment_at
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        throw new Error(
          "Randevu tarihi geçersiz."
        );
      }


      const type =
        cleanText(
          data.appointment_type,
          50
        );


      if (
        !APPOINTMENT_TYPES.includes(
          type
        )
      ) {
        throw new Error(
          "Randevu türü geçersiz."
        );
      }


      const rows =
        await supabaseRest(
          "appointments",
          {
            method: "POST",

            body: {
              patient_id:
                patientId,

              appointment_at:
                date.toISOString(),

              appointment_type:
                type,

              status:
                "Planlandı",

              notes:
                cleanText(
                  data.notes,
                  2000
                ) || null,
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
      "status"
    ) {
      const id =
        cleanText(
          data.id,
          80
        );


      if (
        !isUuid(id)
      ) {
        throw new Error(
          "Randevu ID geçersiz."
        );
      }


      const status =
        cleanText(
          data.status,
          30
        );


      if (
        !APPOINTMENT_STATUSES.includes(
          status
        )
      ) {
        throw new Error(
          "Randevu durumu geçersiz."
        );
      }


      const rows =
        await supabaseRest(
          `appointments?id=eq.${encodeURIComponent(
            id
          )}`,
          {
            method: "PATCH",

            body: {
              status,
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


    throw new Error(
      "Geçersiz işlem."
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Randevu işlemi başarısız.",
      },
      {
        status: 400,
      }
    );
  }
}