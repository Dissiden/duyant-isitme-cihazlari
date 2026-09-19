import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
} from "@/lib/admin-auth";

import {
  cleanText,
  normalizeTc,
  supabaseRest,
} from "@/lib/supabase-rest";


const REPAIR_STATUSES = [
  "Tamire Gönderildi",
  "Serviste",
  "Tamir Tamamlandı",
  "Teslim Edildi",
];


const REPORT_STATUSES = [
  "Raporlu",
  "Raporsuz",
];


const INSTITUTION_STATUSES = [
  "Kurumlu",
  "Kurumsuz",
];


const DEVICE_SIDES = [
  "",
  "Sağ",
  "Sol",
  "Çift",
];


const POWER_TYPES = [
  "",
  "Pilli",
  "Şarjlı",
];


const BATTERY_SIZES = [
  "",
  "10",
  "13",
  "312",
  "675",
];


const PAYMENT_METHODS = [
  "Nakit",
  "Kart",
  "Havale/EFT",
  "Diğer",
];


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


function includesText(
  value,
  search
) {
  return String(value || "")
    .toLocaleLowerCase(
      "tr-TR"
    )
    .includes(
      String(search || "")
        .toLocaleLowerCase(
          "tr-TR"
        )
    );
}


function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}


function nullableText(
  value,
  maxLength = 500
) {
  const text =
    cleanText(
      value,
      maxLength
    );

  return text || null;
}


function sameLocalDay(
  value,
  today
) {
  if (!value) {
    return false;
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }


  return (
    date.getFullYear() ===
      today.getFullYear() &&

    date.getMonth() ===
      today.getMonth() &&

    date.getDate() ===
      today.getDate()
  );
}


function isHearingDevice(
  row
) {
  return (
    String(
      row.category || ""
    )
      .trim()
      .toLocaleLowerCase(
        "tr-TR"
      ) ===
    "işitme cihazı"
  );
}


async function getPatients(
  search = ""
) {
  const rows =
    await supabaseRest(
      "patients?select=*&order=created_at.desc&limit=1000"
    );


  if (!search) {
    return rows || [];
  }


  const q =
    search.trim();


  const numeric =
    q.replace(
      /\D/g,
      ""
    );


  return (rows || []).filter(
    (row) =>
      (
        numeric &&
        String(
          row.tc_identity || ""
        ).includes(
          numeric
        )
      ) ||

      includesText(
        row.full_name,
        q
      ) ||

      includesText(
        row.phone,
        q
      ) ||

      includesText(
        row.device_name,
        q
      ) ||

      includesText(
        row.right_serial_number,
        q
      ) ||

      includesText(
        row.left_serial_number,
        q
      ) ||

      includesText(
        row.report_status,
        q
      ) ||

      includesText(
        row.institution_status,
        q
      )
  );
}


async function getRepairs(
  search = ""
) {
  const rows =
    await supabaseRest(
      "repairs?select=*&order=created_at.desc&limit=1000"
    );


  if (!search) {
    return rows || [];
  }


  const q =
    search.trim();


  const numeric =
    q.replace(
      /\D/g,
      ""
    );


  return (rows || []).filter(
    (row) =>
      (
        numeric &&
        String(
          row.tc_identity || ""
        ).includes(
          numeric
        )
      ) ||

      includesText(
        row.full_name,
        q
      ) ||

      includesText(
        row.phone,
        q
      ) ||

      includesText(
        row.device_name,
        q
      ) ||

      includesText(
        row.status,
        q
      )
  );
}


async function getInventory(
  search = ""
) {
  const rows =
    await supabaseRest(
      "inventory?select=*&order=updated_at.desc&limit=1000"
    );


  if (!search) {
    return rows || [];
  }


  const q =
    search.trim();


  return (rows || []).filter(
    (row) =>
      includesText(
        row.product_name,
        q
      ) ||

      includesText(
        row.brand,
        q
      ) ||

      includesText(
        row.category,
        q
      )
  );
}


async function getDeviceOptions() {
  const rows =
    await supabaseRest(
      "inventory?select=id,product_name,brand,category,stock_quantity,minimum_stock,purchase_price&order=brand.asc,product_name.asc&limit=1000"
    );


  return (rows || [])
    .filter(
      isHearingDevice
    );
}


async function getPatientById(
  id
) {
  const rows =
    await supabaseRest(
      `patients?select=*&id=eq.${encodeURIComponent(
        id
      )}&limit=1`
    );


  return rows?.[0] ||
    null;
}


async function getPayments(
  patientId
) {
  return (
    await supabaseRest(
      `payments?select=*&patient_id=eq.${encodeURIComponent(
        patientId
      )}&order=payment_date.desc,created_at.desc`
    )
  ) || [];
}


async function getAppointments(
  patientId
) {
  return (
    await supabaseRest(
      `appointments?select=*&patient_id=eq.${encodeURIComponent(
        patientId
      )}&order=appointment_at.desc`
    )
  ) || [];
}


async function getPatientRepairs(
  patientId
) {
  return (
    await supabaseRest(
      `repairs?select=*&patient_id=eq.${encodeURIComponent(
        patientId
      )}&order=created_at.desc`
    )
  ) || [];
}


function financialSummary(
  patient,
  payments
) {
  const salePrice =
    Number(
      patient?.sale_price ||
        0
    );


  const totalPaid =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment.amount ||
            0
        ),
      0
    );


  const remaining =
    Math.max(
      salePrice -
        totalPaid,
      0
    );


  let status =
    "Bekliyor";


  if (
    salePrice > 0 &&
    totalPaid >= salePrice
  ) {
    status =
      "Ödendi";

  } else if (
    totalPaid > 0
  ) {
    status =
      "Kısmi";
  }


  return {
    salePrice,
    totalPaid,
    remaining,
    status,
  };
}


async function getPatientProfile(
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


  const patient =
    await getPatientById(
      patientId
    );


  if (!patient) {
    throw new Error(
      "Hasta bulunamadı."
    );
  }


  const [
    payments,
    appointments,
    repairs,
  ] =
    await Promise.all([
      getPayments(
        patientId
      ),

      getAppointments(
        patientId
      ),

      getPatientRepairs(
        patientId
      ),
    ]);


  return {
    patient,
    payments,
    appointments,
    repairs,

    financial:
      financialSummary(
        patient,
        payments
      ),
  };
}


async function getSummary() {
  const [
    patients,
    repairs,
    inventory,
    payments,
    appointments,
  ] =
    await Promise.all([
      getPatients(),
      getRepairs(),
      getInventory(),

      supabaseRest(
        "payments?select=amount,patient_id,payment_date&limit=5000"
      ),

      supabaseRest(
        "appointments?select=*&order=appointment_at.asc&limit=1000"
      ),
    ]);


  const activeRepairs =
    repairs.filter(
      (row) =>
        row.status !==
        "Teslim Edildi"
    );


  const lowStock =
    inventory.filter(
      (row) =>
        Number(
          row.stock_quantity || 0
        ) <=
        Number(
          row.minimum_stock || 0
        )
    );


  const paymentsByPatient =
    new Map();


  for (
    const payment
    of payments || []
  ) {
    const current =
      paymentsByPatient.get(
        payment.patient_id
      ) || 0;


    paymentsByPatient.set(
      payment.patient_id,
      current +
        Number(
          payment.amount || 0
        )
    );
  }


  const totalReceivable =
    patients.reduce(
      (sum, patient) => {
        const sale =
          Number(
            patient.sale_price || 0
          );


        const paid =
          paymentsByPatient.get(
            patient.id
          ) || 0;


        return (
          sum +
          Math.max(
            sale - paid,
            0
          )
        );
      },
      0
    );


  const now =
    new Date();


  const today =
    new Date();


  const todayAppointments =
    (appointments || [])
      .filter(
        (row) =>
          row.status ===
            "Planlandı" &&

          sameLocalDay(
            row.appointment_at,
            today
          )
      );


  const warrantyLimit =
    new Date();


  warrantyLimit.setDate(
    warrantyLimit.getDate() +
      30
  );


  const warrantyExpiring =
    patients.filter(
      (patient) => {
        if (
          !patient.warranty_end_date
        ) {
          return false;
        }


        const end =
          new Date(
            `${patient.warranty_end_date}T23:59:59`
          );


        return (
          end >= now &&
          end <=
            warrantyLimit
        );
      }
    );


  return {
    totals: {
      patients:
        patients.length,

      activeRepairs:
        activeRepairs.length,

      lowStock:
        lowStock.length,

      todayAppointments:
        todayAppointments.length,

      totalReceivable,

      warrantyExpiring:
        warrantyExpiring.length,
    },

    recentPatients:
      patients.slice(
        0,
        5
      ),

    recentRepairs:
      repairs.slice(
        0,
        5
      ),

    lowStock:
      lowStock.slice(
        0,
        5
      ),

    warrantyExpiring:
      warrantyExpiring.slice(
        0,
        5
      ),
  };
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


    const resource =
      cleanText(
        url.searchParams.get(
          "resource"
        ),
        50
      );


    const search =
      cleanText(
        url.searchParams.get(
          "q"
        ),
        160
      );


    const id =
      cleanText(
        url.searchParams.get(
          "id"
        ),
        80
      );


    if (
      resource === "summary"
    ) {
      return NextResponse.json(
        await getSummary()
      );
    }


    if (
      resource === "patients"
    ) {
      return NextResponse.json({
        rows:
          await getPatients(
            search
          ),
      });
    }


    if (
      resource === "repairs"
    ) {
      return NextResponse.json({
        rows:
          await getRepairs(
            search
          ),
      });
    }


    if (
      resource === "inventory"
    ) {
      return NextResponse.json({
        rows:
          await getInventory(
            search
          ),
      });
    }


    if (
      resource ===
      "device-options"
    ) {
      return NextResponse.json({
        rows:
          await getDeviceOptions(),
      });
    }


    if (
      resource ===
      "patient-profile"
    ) {
      return NextResponse.json(
        await getPatientProfile(
          id
        )
      );
    }


    return NextResponse.json(
      {
        error:
          "Geçersiz kaynak.",
      },
      {
        status: 400,
      }
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Veriler alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}


function patientPayload(
  data
) {
  const tcIdentity =
    normalizeTc(
      data.tc_identity
    );


  if (
    tcIdentity.length !==
    11
  ) {
    throw new Error(
      "TC Kimlik No 11 haneli olmalıdır."
    );
  }


  const fullName =
    cleanText(
      data.full_name,
      160
    );


  if (!fullName) {
    throw new Error(
      "Ad soyad zorunludur."
    );
  }


  const inventoryId =
    cleanText(
      data.inventory_id,
      80
    );


  if (
    !isUuid(
      inventoryId
    )
  ) {
    throw new Error(
      "Envanterden bir işitme cihazı seçmelisiniz."
    );
  }


  const reportStatus =
    cleanText(
      data.report_status,
      30
    );


  if (
    !REPORT_STATUSES.includes(
      reportStatus
    )
  ) {
    throw new Error(
      "Rapor durumu seçilmelidir."
    );
  }


  const institutionStatus =
    cleanText(
      data.institution_status,
      30
    );


  if (
    !INSTITUTION_STATUSES.includes(
      institutionStatus
    )
  ) {
    throw new Error(
      "Kurum durumu seçilmelidir."
    );
  }


  const deviceSide =
    cleanText(
      data.device_side,
      20
    );


  if (
    !DEVICE_SIDES.includes(
      deviceSide
    )
  ) {
    throw new Error(
      "Cihaz tarafı geçersiz."
    );
  }


  const powerType =
    cleanText(
      data.power_type,
      20
    );


  if (
    !POWER_TYPES.includes(
      powerType
    )
  ) {
    throw new Error(
      "Cihaz güç tipi geçersiz."
    );
  }


  const batterySize =
    cleanText(
      data.battery_size,
      10
    );


  if (
    !BATTERY_SIZES.includes(
      batterySize
    )
  ) {
    throw new Error(
      "Pil numarası geçersiz."
    );
  }


  const rawPrice =
    String(
      data.sale_price ?? ""
    )
      .trim()
      .replace(
        ",",
        "."
      );


  if (!rawPrice) {
    throw new Error(
      "Satış fiyatı zorunludur."
    );
  }


  const salePrice =
    Number(
      rawPrice
    );


  if (
    !Number.isFinite(
      salePrice
    ) ||
    salePrice < 0
  ) {
    throw new Error(
      "Satış fiyatı geçersiz."
    );
  }


  if (
    data.warranty_start_date &&
    data.warranty_end_date &&
    data.warranty_end_date <
      data.warranty_start_date
  ) {
    throw new Error(
      "Garanti bitiş tarihi başlangıç tarihinden önce olamaz."
    );
  }


  return {
    full_name:
      fullName,

    tc_identity:
      tcIdentity,

    phone:
      cleanText(
        data.phone,
        30
      ),

    address:
      cleanText(
        data.address,
        1000
      ),

    inventory_id:
      inventoryId,

    sale_price:
      salePrice,

    report_status:
      reportStatus,

    institution_status:
      institutionStatus,

    purchase_date:
      data.purchase_date ||
      null,

    notes:
      cleanText(
        data.notes,
        3000
      ),

    device_side:
      deviceSide,

    right_serial_number:
      cleanText(
        data.right_serial_number,
        120
      ),

    left_serial_number:
      cleanText(
        data.left_serial_number,
        120
      ),

    power_type:
      powerType,

    battery_size:
      batterySize,

    warranty_start_date:
      data.warranty_start_date ||
      null,

    warranty_end_date:
      data.warranty_end_date ||
      null,
  };
}


async function savePatient(
  action,
  data
) {
  const payload =
    patientPayload(
      data
    );


  const rpcBody = {
    p_full_name:
      payload.full_name,

    p_tc_identity:
      payload.tc_identity,

    p_phone:
      payload.phone,

    p_address:
      payload.address,

    p_inventory_id:
      payload.inventory_id,

    p_sale_price:
      payload.sale_price,

    p_report_status:
      payload.report_status,

    p_institution_status:
      payload.institution_status,

    p_purchase_date:
      payload.purchase_date,

    p_notes:
      payload.notes,

    p_device_side:
      payload.device_side,

    p_right_serial_number:
      payload.right_serial_number,

    p_left_serial_number:
      payload.left_serial_number,

    p_power_type:
      payload.power_type,

    p_battery_size:
      payload.battery_size,

    p_warranty_start_date:
      payload.warranty_start_date,

    p_warranty_end_date:
      payload.warranty_end_date,
  };


  if (
    action === "create"
  ) {
    return await supabaseRest(
      "rpc/admin_create_patient_with_stock",
      {
        method: "POST",
        body: rpcBody,
      }
    );
  }


  const patientId =
    cleanText(
      data.id,
      80
    );


  if (
    !isUuid(
      patientId
    )
  ) {
    throw new Error(
      "Hasta kayıt ID'si geçersiz."
    );
  }


  return await supabaseRest(
    "rpc/admin_update_patient_with_stock",
    {
      method: "POST",

      body: {
        p_patient_id:
          patientId,

        ...rpcBody,
      },
    }
  );
}


async function repairPayload(
  data
) {
  const tcIdentity =
    normalizeTc(
      data.tc_identity
    );


  if (
    tcIdentity.length !==
    11
  ) {
    throw new Error(
      "TC Kimlik No 11 haneli olmalıdır."
    );
  }


  const fullName =
    cleanText(
      data.full_name,
      160
    );


  if (!fullName) {
    throw new Error(
      "Ad soyad zorunludur."
    );
  }


  if (!data.sent_date) {
    throw new Error(
      "Tamire gönderilen tarih zorunludur."
    );
  }


  const status =
    REPAIR_STATUSES.includes(
      data.status
    )
      ? data.status
      : "Tamire Gönderildi";


  let patientId =
    data.patient_id ||
    null;


  if (!patientId) {
    const patients =
      await supabaseRest(
        `patients?select=id&tc_identity=eq.${encodeURIComponent(
          tcIdentity
        )}&limit=1`
      );


    patientId =
      patients?.[0]?.id ||
      null;
  }


  return {
    patient_id:
      patientId,

    tc_identity:
      tcIdentity,

    full_name:
      fullName,

    phone:
      cleanText(
        data.phone,
        30
      ),

    device_name:
      cleanText(
        data.device_name,
        200
      ),

    sent_date:
      data.sent_date,

    status,

    description:
      cleanText(
        data.description,
        3000
      ),
  };
}


function inventoryPayload(
  data
) {
  const productName =
    cleanText(
      data.product_name,
      200
    );


  if (!productName) {
    throw new Error(
      "Ürün / model adı zorunludur."
    );
  }


  const brand =
    cleanText(
      data.brand,
      120
    );


  if (!brand) {
    throw new Error(
      "Marka seçmelisiniz."
    );
  }


  const category =
    cleanText(
      data.category,
      120
    );


  if (!category) {
    throw new Error(
      "Kategori seçmelisiniz."
    );
  }


  const stockQuantity =
    Number(
      data.stock_quantity ??
        0
    );


  const minimumStock =
    Number(
      data.minimum_stock ??
        0
    );


  const purchasePrice =
    Number(
      String(
        data.purchase_price ??
          "0"
      ).replace(
        ",",
        "."
      )
    );


  if (
    !Number.isInteger(
      stockQuantity
    ) ||
    stockQuantity < 0
  ) {
    throw new Error(
      "Stok miktarı geçersiz."
    );
  }


  if (
    !Number.isInteger(
      minimumStock
    ) ||
    minimumStock < 0
  ) {
    throw new Error(
      "Minimum stok miktarı geçersiz."
    );
  }


  if (
    !Number.isFinite(
      purchasePrice
    ) ||
    purchasePrice < 0
  ) {
    throw new Error(
      "Alış fiyatı geçersiz."
    );
  }


  return {
    product_name:
      productName,

    brand,

    category,

    stock_quantity:
      stockQuantity,

    minimum_stock:
      minimumStock,

    purchase_price:
      purchasePrice,

    notes:
      cleanText(
        data.notes,
        1000
      ),
  };
}


async function createPayment(
  data
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


  const amount =
    Number(
      String(
        data.amount ?? ""
      ).replace(
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
      "Geçerli bir tahsilat tutarı girin."
    );
  }


  const method =
    cleanText(
      data.payment_method,
      30
    );


  if (
    !PAYMENT_METHODS.includes(
      method
    )
  ) {
    throw new Error(
      "Ödeme yöntemi geçersiz."
    );
  }


  const profile =
    await getPatientProfile(
      patientId
    );


  if (
    amount >
    profile.financial.remaining +
      0.01
  ) {
    throw new Error(
      `Kalan borçtan fazla tahsilat girilemez. Kalan: ${profile.financial.remaining} TL`
    );
  }


  const rows =
    await supabaseRest(
      "payments",
      {
        method: "POST",

        body: {
          patient_id:
            patientId,

          amount,

          payment_date:
            data.payment_date ||
            new Date()
              .toISOString()
              .slice(
                0,
                10
              ),

          payment_method:
            method,

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


  return rows?.[0] ||
    null;
}


async function saveAppointment(
  action,
  data
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


  const appointmentType =
    cleanText(
      data.appointment_type,
      50
    );


  if (
    !APPOINTMENT_TYPES.includes(
      appointmentType
    )
  ) {
    throw new Error(
      "Randevu türü geçersiz."
    );
  }


  const status =
    cleanText(
      data.status ||
        "Planlandı",
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


  const payload = {
    patient_id:
      patientId,

    appointment_at:
      date.toISOString(),

    appointment_type:
      appointmentType,

    status,

    notes:
      nullableText(
        data.notes,
        2000
      ),
  };


  if (
    action === "create"
  ) {
    const rows =
      await supabaseRest(
        "appointments",
        {
          method: "POST",

          body:
            payload,

          prefer:
            "return=representation",
        }
      );


    return rows?.[0] ||
      null;
  }


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
      "Randevu ID geçersiz."
    );
  }


  const rows =
    await supabaseRest(
      `appointments?id=eq.${encodeURIComponent(
        id
      )}`,
      {
        method: "PATCH",

        body:
          payload,

        prefer:
          "return=representation",
      }
    );


  return rows?.[0] ||
    null;
}


function mapDatabaseError(
  message
) {
  if (
    message.includes(
      "OUT_OF_STOCK"
    )
  ) {
    return "Seçilen cihaz için yeterli stok yok.";
  }


  if (
    message.includes(
      "DEVICE_NOT_FOUND"
    )
  ) {
    return "Seçilen cihaz envanterde bulunamadı.";
  }


  if (
    message.includes(
      "PATIENT_NOT_FOUND"
    )
  ) {
    return "Hasta kaydı bulunamadı.";
  }


  if (
    message.includes(
      "patients_tc_identity_key"
    ) ||
    message.includes(
      "duplicate key"
    )
  ) {
    return "Bu TC Kimlik No ile kayıtlı bir hasta zaten var.";
  }


  return message;
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


    const resource =
      cleanText(
        body.resource,
        40
      );


    const action =
      cleanText(
        body.action ||
          "create",
        20
      );


    const data =
      body.data || {};


    if (
      resource === "patients"
    ) {
      const rows =
        await savePatient(
          action,
          data
        );


      return NextResponse.json(
        {
          row:
            rows?.[0] ||
            null,
        },
        {
          status:
            action ===
            "create"
              ? 201
              : 200,
        }
      );
    }


    if (
      resource === "payments"
    ) {
      const row =
        await createPayment(
          data
        );


      return NextResponse.json(
        {
          row,
        },
        {
          status: 201,
        }
      );
    }


    if (
      resource === "appointments"
    ) {
      const row =
        await saveAppointment(
          action,
          data
        );


      return NextResponse.json(
        {
          row,
        },
        {
          status:
            action ===
            "create"
              ? 201
              : 200,
        }
      );
    }


    if (
      resource === "repairs"
    ) {
      const payload =
        await repairPayload(
          data
        );


      if (
        action === "create"
      ) {
        const rows =
          await supabaseRest(
            "repairs",
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
          "Tamir kayıt ID'si geçersiz."
        );
      }


      const rows =
        await supabaseRest(
          `repairs?id=eq.${encodeURIComponent(
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
      resource === "inventory"
    ) {
      const payload =
        inventoryPayload(
          data
        );


      if (
        action === "create"
      ) {
        const rows =
          await supabaseRest(
            "inventory",
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
          "Envanter kayıt ID'si geçersiz."
        );
      }


      const rows =
        await supabaseRest(
          `inventory?id=eq.${encodeURIComponent(
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


    throw new Error(
      "Geçersiz kaynak."
    );

  } catch (error) {
    return NextResponse.json(
      {
        error:
          mapDatabaseError(
            error.message ||
              "İşlem başarısız."
          ),
      },
      {
        status: 400,
      }
    );
  }
}