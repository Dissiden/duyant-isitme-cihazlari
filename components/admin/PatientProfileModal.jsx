"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  FileText,
  History,
  Pencil,
  Phone,
  Printer,
  ReceiptText,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

import {
  printPaymentReceipt,
} from "@/lib/payment-receipt";

import styles from "./FinanceExtras.module.css";


function localDateInputValue() {
  const now =
    new Date();


  const local =
    new Date(
      now.getTime() -
        now.getTimezoneOffset() *
          60000
    );


  return local
    .toISOString()
    .slice(
      0,
      10
    );
}


const EMPTY_PAYMENT = {
  amount: "",
  payment_date:
    localDateInputValue(),
  payment_method:
    "Nakit",
  note: "",
};


const EMPTY_APPOINTMENT = {
  appointment_at: "",
  appointment_type:
    "Kontrol",
  status:
    "Planlandı",
  notes: "",
};


const EMPTY_COST_FORM = {
  purchase_cost: "",
  reason: "",
};


const EMPTY_PROMISE = {
  due_date: "",
  amount: "",
  note: "",
};


async function requestJson(
  url,
  options = {}
) {
  const response =
    await fetch(
      url,
      {
        ...options,

        headers: {
          ...(options.body
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          ...(options.headers ||
            {}),
        },

        cache:
          "no-store",
      }
    );


  const data =
    await response
      .json()
      .catch(
        () => ({})
      );


  if (!response.ok) {
    throw new Error(
      data.error ||
        "İşlem başarısız."
    );
  }


  return data;
}


function formatMoney(
  value
) {
  return new Intl.NumberFormat(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );
}


function formatDate(
  value
) {
  if (!value) {
    return "—";
  }


  const date =
    new Date(
      String(value).includes("T")
        ? value
        : `${value}T12:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }


  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(date);
}


function formatDateTime(
  value
) {
  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


function paymentClass(
  status
) {
  if (
    status ===
    "Ödendi"
  ) {
    return "green";
  }


  if (
    status ===
      "Kısmi" ||
    status ===
      "Fazla Tahsilat"
  ) {
    return "orange";
  }


  return "gray";
}


function InfoItem({
  label,
  value,
}) {
  return (
    <div className="patient-profile-info-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}


function getAuditTitle(
  row
) {
  if (
    row.entity_type ===
      "payment" &&
    row.action ===
      "update"
  ) {
    return "Tahsilat düzeltildi";
  }


  if (
    row.entity_type ===
      "payment" &&
    row.action ===
      "delete"
  ) {
    return "Tahsilat iptal edildi";
  }


  if (
    row.entity_type ===
    "patient_cost"
  ) {
    return "Satış maliyeti düzeltildi";
  }


  return "Kayıt güncellendi";
}


function getAuditDifference(
  row
) {
  if (
    row.entity_type ===
      "payment" &&
    row.action ===
      "update"
  ) {
    return `${formatMoney(
      row.old_value?.amount ||
        0
    )} → ${formatMoney(
      row.new_value?.amount ||
        0
    )}`;
  }


  if (
    row.entity_type ===
      "payment" &&
    row.action ===
      "delete"
  ) {
    return `${formatMoney(
      row.old_value?.amount ||
        0
    )} tahsilat iptal edildi`;
  }


  if (
    row.entity_type ===
    "patient_cost"
  ) {
    return `${formatMoney(
      row.old_value?.purchase_cost ||
        0
    )} → ${formatMoney(
      row.new_value?.purchase_cost ||
        0
    )}`;
  }


  return "";
}


function promiseDisplayStatus(
  row
) {
  if (
    row.status ===
    "Ödendi"
  ) {
    return "Ödendi";
  }


  if (
    row.status ===
    "İptal"
  ) {
    return "İptal";
  }


  const today =
    localDateInputValue();


  if (
    row.due_date <
    today
  ) {
    return "Gecikti";
  }


  if (
    row.due_date ===
    today
  ) {
    return "Bugün";
  }


  return "Bekliyor";
}


function promiseStatusClass(
  status
) {
  if (
    status ===
    "Ödendi"
  ) {
    return `${styles.status} ${styles.statusPaid}`;
  }


  if (
    status ===
    "İptal"
  ) {
    return `${styles.status} ${styles.statusCanceled}`;
  }


  if (
    status ===
    "Gecikti"
  ) {
    return `${styles.status} ${styles.statusLate}`;
  }


  if (
    status ===
    "Bugün"
  ) {
    return `${styles.status} ${styles.statusToday}`;
  }


  return `${styles.status} ${styles.statusWaiting}`;
}


export default function PatientProfileModal({
  patientId,
  onClose,
  onChanged,
  onEditPatient,
}) {
  const [
    profile,
    setProfile,
  ] =
    useState(null);


  const [
    auditLogs,
    setAuditLogs,
  ] =
    useState([]);


  const [
    promises,
    setPromises,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    paymentForm,
    setPaymentForm,
  ] =
    useState({
      ...EMPTY_PAYMENT,
    });


  const [
    appointmentForm,
    setAppointmentForm,
  ] =
    useState({
      ...EMPTY_APPOINTMENT,
    });


  const [
    promiseForm,
    setPromiseForm,
  ] =
    useState({
      ...EMPTY_PROMISE,
    });


  const [
    editingPayment,
    setEditingPayment,
  ] =
    useState(null);


  const [
    editPaymentForm,
    setEditPaymentForm,
  ] =
    useState(null);


  const [
    editingPromise,
    setEditingPromise,
  ] =
    useState(null);


  const [
    editPromiseForm,
    setEditPromiseForm,
  ] =
    useState(null);


  const [
    selectedPromiseId,
    setSelectedPromiseId,
  ] =
    useState(null);


  const [
    costForm,
    setCostForm,
  ] =
    useState({
      ...EMPTY_COST_FORM,
    });


  const [
    savingPayment,
    setSavingPayment,
  ] =
    useState(false);


  const [
    savingPaymentEdit,
    setSavingPaymentEdit,
  ] =
    useState(false);


  const [
    deletingPayment,
    setDeletingPayment,
  ] =
    useState(false);


  const [
    savingCost,
    setSavingCost,
  ] =
    useState(false);


  const [
    savingAppointment,
    setSavingAppointment,
  ] =
    useState(false);


  const [
    savingPromise,
    setSavingPromise,
  ] =
    useState(false);


  const [
    promiseActionId,
    setPromiseActionId,
  ] =
    useState(null);


  useEffect(
    () => {
      loadProfile();
    },
    [patientId]
  );


  const financial =
    useMemo(
      () => {
        if (!profile) {
          return {
            salePrice: 0,
            totalPaid: 0,
            remaining: 0,
            overpayment: 0,
            purchaseCost: 0,
            grossProfit: 0,
            grossMargin: 0,
            status: "Bekliyor",
          };
        }


        const salePrice =
          Number(
            profile.patient
              ?.sale_price ||
              0
          );


        const totalPaid =
          (
            profile.payments ||
            []
          ).reduce(
            (
              sum,
              payment
            ) =>
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


        const overpayment =
          Math.max(
            totalPaid -
              salePrice,
            0
          );


        const purchaseCost =
          Number(
            profile.patient
              ?.purchase_cost ||
              0
          );


        const grossProfit =
          salePrice -
          purchaseCost;


        const grossMargin =
          salePrice > 0
            ? (
                grossProfit /
                salePrice
              ) * 100
            : 0;


        let status =
          "Bekliyor";


        if (
          overpayment >
          0.01
        ) {
          status =
            "Fazla Tahsilat";

        } else if (
          salePrice > 0 &&
          totalPaid >=
            salePrice
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
          overpayment,
          purchaseCost,
          grossProfit,
          grossMargin,
          status,
        };
      },
      [profile]
    );


  const openPromiseTotal =
    useMemo(
      () =>
        promises
          .filter(
            (row) =>
              row.status ===
              "Bekliyor"
          )
          .reduce(
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
          ),
      [promises]
    );


  const unplannedRemaining =
    Math.max(
      financial.remaining -
        openPromiseTotal,
      0
    );


  const selectedPromise =
    promises.find(
      (row) =>
        row.id ===
        selectedPromiseId
    ) || null;


  async function loadProfile() {
    if (!patientId) {
      return;
    }


    setLoading(true);
    setError("");


    try {
      const [
        profileData,
        auditData,
        promiseData,
      ] =
        await Promise.all([
          requestJson(
            `/api/admin/data?resource=patient-profile&id=${encodeURIComponent(
              patientId
            )}`
          ),

          requestJson(
            `/api/admin/patient-finance?patient_id=${encodeURIComponent(
              patientId
            )}`
          ),

          requestJson(
            `/api/admin/payment-promises?patient_id=${encodeURIComponent(
              patientId
            )}`
          ),
        ]);


      setProfile(
        profileData
      );


      setAuditLogs(
        auditData.rows ||
          []
      );


      setPromises(
        promiseData.rows ||
          []
      );


      setCostForm({
        purchase_cost:
          String(
            profileData.patient
              ?.purchase_cost ??
              0
          ),

        reason: "",
      });

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  }


  async function refreshAll() {
    await loadProfile();


    if (onChanged) {
      await onChanged();
    }
  }


  function resetPaymentForm() {
    setPaymentForm({
      ...EMPTY_PAYMENT,

      payment_date:
        localDateInputValue(),
    });

    setSelectedPromiseId(
      null
    );
  }


  async function savePayment(
    event
  ) {
    event.preventDefault();

    setSavingPayment(true);
    setError("");


    try {
      if (
        selectedPromiseId
      ) {
        await requestJson(
          "/api/admin/payment-promises",
          {
            method:
              "POST",

            body:
              JSON.stringify({
                action:
                  "collect",

                data: {
                  id:
                    selectedPromiseId,

                  payment_date:
                    paymentForm.payment_date,

                  payment_method:
                    paymentForm.payment_method,

                  note:
                    paymentForm.note,
                },
              }),
          }
        );

      } else {
        await requestJson(
          "/api/admin/data",
          {
            method:
              "POST",

            body:
              JSON.stringify({
                resource:
                  "payments",

                action:
                  "create",

                data: {
                  ...paymentForm,

                  patient_id:
                    patientId,
                },
              }),
          }
        );
      }


      resetPaymentForm();

      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingPayment(
        false
      );
    }
  }


  function selectPromiseForCollection(
    promise
  ) {
    if (
      promise.status !==
      "Bekliyor"
    ) {
      return;
    }


    if (
      Number(
        promise.amount ||
          0
      ) >
      financial.remaining +
        0.01
    ) {
      setError(
        "Bu ödeme planının tutarı güncel kalan borçtan yüksek. Planı düzenleyin veya iptal edip yenisini oluşturun."
      );

      return;
    }


    setError("");

    setSelectedPromiseId(
      promise.id
    );


    setPaymentForm({
      amount:
        String(
          promise.amount ||
            ""
        ),

      payment_date:
        localDateInputValue(),

      payment_method:
        "Nakit",

      note:
        promise.note
          ? `Ödeme planı: ${promise.note}`
          : "Ödeme planı tahsilatı",
    });
  }


  async function savePromise(
    event
  ) {
    event.preventDefault();

    setSavingPromise(true);
    setError("");


    try {
      await requestJson(
        "/api/admin/payment-promises",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "create",

              data: {
                patient_id:
                  patientId,

                ...promiseForm,
              },
            }),
        }
      );


      setPromiseForm({
        ...EMPTY_PROMISE,
      });


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingPromise(
        false
      );
    }
  }


  function startEditPromise(
    promise
  ) {
    setEditingPromise(
      promise.id
    );


    setEditPromiseForm({
      id:
        promise.id,

      due_date:
        promise.due_date ||
        "",

      amount:
        String(
          promise.amount ??
            ""
        ),

      note:
        promise.note ||
        "",
    });
  }


  async function savePromiseEdit(
    event
  ) {
    event.preventDefault();


    if (
      !editPromiseForm
    ) {
      return;
    }


    setPromiseActionId(
      editPromiseForm.id
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/payment-promises",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "update",

              data:
                editPromiseForm,
            }),
        }
      );


      setEditingPromise(
        null
      );

      setEditPromiseForm(
        null
      );


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setPromiseActionId(
        null
      );
    }
  }


  async function cancelPromise(
    promise
  ) {
    const confirmed =
      window.confirm(
        `${formatMoney(
          promise.amount
        )} tutarındaki ödeme planı iptal edilsin mi?`
      );


    if (!confirmed) {
      return;
    }


    setPromiseActionId(
      promise.id
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/payment-promises",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "cancel",

              data: {
                id:
                  promise.id,
              },
            }),
        }
      );


      if (
        selectedPromiseId ===
        promise.id
      ) {
        resetPaymentForm();
      }


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setPromiseActionId(
        null
      );
    }
  }


  function startEditPayment(
    payment
  ) {
    setEditingPayment(
      payment.id
    );


    setEditPaymentForm({
      id:
        payment.id,

      amount:
        String(
          payment.amount ??
            ""
        ),

      payment_date:
        payment.payment_date ||
        "",

      payment_method:
        payment.payment_method ||
        "Nakit",

      note:
        payment.note ||
        "",

      reason:
        "",
    });
  }


  async function savePaymentEdit(
    event
  ) {
    event.preventDefault();


    if (
      !editPaymentForm
    ) {
      return;
    }


    setSavingPaymentEdit(
      true
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/patient-finance",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "update-payment",

              data:
                editPaymentForm,
            }),
        }
      );


      setEditingPayment(
        null
      );

      setEditPaymentForm(
        null
      );


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingPaymentEdit(
        false
      );
    }
  }


  async function deletePayment() {
    if (
      !editPaymentForm
    ) {
      return;
    }


    if (
      String(
        editPaymentForm.reason ||
          ""
      ).trim().length <
      3
    ) {
      setError(
        "Tahsilatı iptal etmek için düzeltme / iptal nedeni yazmalısınız."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `${formatMoney(
          editPaymentForm.amount
        )} tutarındaki tahsilat iptal edilsin mi?\n\nİşlem finans geçmişinde saklanacaktır.`
      );


    if (!confirmed) {
      return;
    }


    setDeletingPayment(
      true
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/patient-finance",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "delete-payment",

              data: {
                id:
                  editPaymentForm.id,

                reason:
                  editPaymentForm.reason,
              },
            }),
        }
      );


      setEditingPayment(
        null
      );

      setEditPaymentForm(
        null
      );


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setDeletingPayment(
        false
      );
    }
  }


  async function saveCost(
    event
  ) {
    event.preventDefault();

    setSavingCost(true);
    setError("");


    try {
      await requestJson(
        "/api/admin/patient-finance",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "update-cost",

              data: {
                patient_id:
                  patientId,

                purchase_cost:
                  costForm.purchase_cost,

                reason:
                  costForm.reason,
              },
            }),
        }
      );


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingCost(
        false
      );
    }
  }


  async function saveAppointment(
    event
  ) {
    event.preventDefault();

    setSavingAppointment(
      true
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/data",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              resource:
                "appointments",

              action:
                "create",

              data: {
                ...appointmentForm,

                patient_id:
                  patientId,
              },
            }),
        }
      );


      setAppointmentForm({
        ...EMPTY_APPOINTMENT,
      });


      await refreshAll();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingAppointment(
        false
      );
    }
  }


  function printReceipt(
    payment
  ) {
    if (
      !profile?.patient
    ) {
      return;
    }


    printPaymentReceipt({
      patient:
        profile.patient,

      payment,

      salePrice:
        financial.salePrice,

      totalPaid:
        financial.totalPaid,

      remaining:
        financial.remaining,
    });
  }


  if (!patientId) {
    return null;
  }


  return (
    <div
      className="admin-modal-backdrop patient-profile-backdrop"
      onMouseDown={
        onClose
      }
    >

      <section
        className="patient-profile-modal"
        onMouseDown={
          (event) =>
            event.stopPropagation()
        }
      >

        <header className="patient-profile-header">

          <div>

            <span className="patient-profile-kicker">
              Hasta Profili
            </span>

            <h2>
              {profile?.patient
                ?.full_name ||
                "Hasta"}
            </h2>

            <p>
              Hasta, cihaz, ödeme,
              ödeme planı, kontrol ve servis geçmişi.
            </p>

          </div>


          <div className="patient-profile-header-actions">

            {profile?.patient &&
              onEditPatient && (

                <button
                  type="button"
                  className="admin-outline-button"
                  onClick={
                    () =>
                      onEditPatient(
                        profile.patient
                      )
                  }
                >
                  Hasta Bilgilerini Düzenle
                </button>

              )}


            <button
              type="button"
              className="patient-profile-close"
              onClick={
                onClose
              }
              aria-label="Kapat"
            >
              <X size={20} />
            </button>

          </div>

        </header>


        <div className="patient-profile-body">

          {loading && (

            <div className="admin-loading-card">
              Hasta profili yükleniyor...
            </div>

          )}


          {error && (

            <div className="admin-form-error">
              {error}
            </div>

          )}


          {!loading &&
            profile && (

            <>

              <section className="patient-profile-hero">

                <div className="patient-profile-person">

                  <span className="patient-profile-avatar-large">
                    <UserRound
                      size={30}
                    />
                  </span>


                  <div>

                    <h3>
                      {
                        profile.patient
                          .full_name
                      }
                    </h3>

                    <p>
                      TC:{" "}
                      {
                        profile.patient
                          .tc_identity
                      }
                    </p>


                    {profile.patient
                      .phone && (

                      <a
                        href={
                          `tel:${profile.patient.phone}`
                        }
                      >
                        <Phone
                          size={14}
                        />

                        {
                          profile.patient
                            .phone
                        }
                      </a>

                    )}

                  </div>

                </div>


                <div className="patient-profile-statuses">

                  <span
                    className={
                      `admin-badge ${
                        profile.patient
                          .report_status ===
                        "Raporlu"
                          ? "green"
                          : "gray"
                      }`
                    }
                  >
                    {
                      profile.patient
                        .report_status
                    }
                  </span>


                  <span
                    className={
                      `admin-badge ${
                        profile.patient
                          .institution_status ===
                        "Kurumlu"
                          ? "blue"
                          : "gray"
                      }`
                    }
                  >
                    {
                      profile.patient
                        .institution_status
                    }
                  </span>

                </div>

              </section>


              {financial.overpayment >
                0.01 && (

                <div className={styles.overpaymentAlert}>
                  Dikkat: Satış bedelinden{" "}
                  {formatMoney(
                    financial.overpayment
                  )}{" "}
                  fazla tahsilat görünüyor.
                  Ödeme geçmişinden hatalı
                  tahsilatı düzenleyin.
                </div>

              )}


              <div className="patient-profile-grid">

                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <Smartphone
                      size={19}
                    />

                    <strong>
                      Cihaz Bilgileri
                    </strong>

                  </div>


                  <div className="patient-profile-info-grid">

                    <InfoItem
                      label="Cihaz"
                      value={
                        profile.patient
                          .device_name
                      }
                    />

                    <InfoItem
                      label="Taraf"
                      value={
                        profile.patient
                          .device_side
                      }
                    />

                    <InfoItem
                      label="Sağ Seri No"
                      value={
                        profile.patient
                          .right_serial_number
                      }
                    />

                    <InfoItem
                      label="Sol Seri No"
                      value={
                        profile.patient
                          .left_serial_number
                      }
                    />

                    <InfoItem
                      label="Tip"
                      value={
                        profile.patient
                          .power_type
                      }
                    />

                    <InfoItem
                      label="Pil No"
                      value={
                        profile.patient
                          .power_type ===
                        "Pilli"
                          ? profile.patient
                              .battery_size
                          : "—"
                      }
                    />

                  </div>

                </section>


                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <ShieldCheck
                      size={19}
                    />

                    <strong>
                      Satış & Garanti
                    </strong>

                  </div>


                  <div className="patient-profile-info-grid">

                    <InfoItem
                      label="Satış Tarihi"
                      value={
                        formatDate(
                          profile.patient
                            .purchase_date
                        )
                      }
                    />

                    <InfoItem
                      label="Satış Bedeli"
                      value={
                        formatMoney(
                          financial.salePrice
                        )
                      }
                    />

                    <InfoItem
                      label="Garanti Başlangıç"
                      value={
                        formatDate(
                          profile.patient
                            .warranty_start_date
                        )
                      }
                    />

                    <InfoItem
                      label="Garanti Bitiş"
                      value={
                        formatDate(
                          profile.patient
                            .warranty_end_date
                        )
                      }
                    />

                  </div>

                </section>

              </div>


              <section className={styles.financialGrid}>

                <article>

                  <span>
                    Satış Bedeli
                  </span>

                  <strong>
                    {formatMoney(
                      financial.salePrice
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Toplam Tahsilat
                  </span>

                  <strong>
                    {formatMoney(
                      financial.totalPaid
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Kalan
                  </span>

                  <strong>
                    {formatMoney(
                      financial.remaining
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Cihaz Maliyeti
                  </span>

                  <strong>
                    {formatMoney(
                      financial.purchaseCost
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Brüt Kâr
                  </span>

                  <strong>
                    {formatMoney(
                      financial.grossProfit
                    )}
                  </strong>

                  <small>
                    %
                    {
                      financial.grossMargin
                        .toFixed(1)
                        .replace(
                          ".",
                          ","
                        )
                    }
                  </small>

                </article>


                <article>

                  <span>
                    Ödeme Durumu
                  </span>

                  <strong>

                    <span
                      className={
                        `admin-badge ${paymentClass(
                          financial.status
                        )}`
                      }
                    >
                      {
                        financial.status
                      }
                    </span>

                  </strong>

                </article>

              </section>


              <div className="patient-profile-two-column">

                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <Wallet
                      size={19}
                    />

                    <strong>
                      Tahsilat
                    </strong>

                  </div>


                  {selectedPromise && (

                    <div className={styles.selectedPromiseNotice}>

                      <span>
                        {formatDate(
                          selectedPromise.due_date
                        )} tarihli{" "}
                        <strong>
                          {formatMoney(
                            selectedPromise.amount
                          )}
                        </strong>{" "}
                        ödeme planı tahsilata aktarılıyor.
                      </span>


                      <button
                        type="button"
                        onClick={
                          resetPaymentForm
                        }
                      >
                        Vazgeç
                      </button>

                    </div>

                  )}


                  {financial.overpayment >
                  0.01 ? (

                    <div
                      className="patient-profile-paid"
                      style={{
                        background:
                          "#fff1f1",
                        color:
                          "#991b1b",
                      }}
                    >
                      Önce fazla tahsilat
                      kaydını düzeltin.
                    </div>

                  ) : financial.remaining >
                    0 ? (

                    <form
                      className="patient-profile-mini-form"
                      onSubmit={
                        savePayment
                      }
                    >

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        max={
                          financial.remaining
                        }
                        placeholder="Tutar"
                        value={
                          paymentForm.amount
                        }
                        onChange={
                          (event) =>
                            setPaymentForm({
                              ...paymentForm,

                              amount:
                                event.target.value,
                            })
                        }
                        disabled={
                          Boolean(
                            selectedPromiseId
                          )
                        }
                        required
                      />


                      <input
                        type="date"
                        value={
                          paymentForm.payment_date
                        }
                        onChange={
                          (event) =>
                            setPaymentForm({
                              ...paymentForm,

                              payment_date:
                                event.target.value,
                            })
                        }
                        required
                      />


                      <select
                        value={
                          paymentForm.payment_method
                        }
                        onChange={
                          (event) =>
                            setPaymentForm({
                              ...paymentForm,

                              payment_method:
                                event.target.value,
                            })
                        }
                      >
                        <option value="Nakit">
                          Nakit
                        </option>

                        <option value="Kart">
                          Kart
                        </option>

                        <option value="Havale/EFT">
                          Havale/EFT
                        </option>

                        <option value="Diğer">
                          Diğer
                        </option>
                      </select>


                      <input
                        placeholder="Not"
                        value={
                          paymentForm.note
                        }
                        onChange={
                          (event) =>
                            setPaymentForm({
                              ...paymentForm,

                              note:
                                event.target.value,
                            })
                        }
                      />


                      <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={
                          savingPayment
                        }
                      >
                        <CreditCard
                          size={16}
                        />

                        {savingPayment
                          ? "Kaydediliyor..."
                          : selectedPromiseId
                            ? "Planı Tahsil Et"
                            : "Tahsilatı Kaydet"}
                      </button>

                    </form>

                  ) : (

                    <div className="patient-profile-paid">
                      Bu satışın ödemesi tamamlandı.
                    </div>

                  )}


                  <div className="patient-profile-history">

                    <h4>
                      Ödeme Geçmişi
                    </h4>


                    {profile.payments
                      .length ===
                    0 ? (

                      <p className="patient-profile-empty">
                        Henüz tahsilat yok.
                      </p>

                    ) : (

                      profile.payments.map(
                        (payment) => (

                          <div
                            key={
                              payment.id
                            }
                          >

                            <div className="patient-profile-history-row">

                              <div>

                                <strong>
                                  {formatMoney(
                                    payment.amount
                                  )}
                                </strong>

                                <span>
                                  {
                                    payment.payment_method
                                  }
                                </span>

                              </div>


                              <div>

                                <strong>
                                  {formatDate(
                                    payment.payment_date
                                  )}
                                </strong>

                                <span>
                                  {payment.note ||
                                    ""}
                                </span>

                              </div>


                              <div className={styles.actionRow}>

                                <button
                                  type="button"
                                  className={styles.receiptButton}
                                  onClick={
                                    () =>
                                      printReceipt(
                                        payment
                                      )
                                  }
                                >
                                  <Printer
                                    size={13}
                                  />
                                  Makbuz
                                </button>


                                <button
                                  type="button"
                                  className={styles.miniButton}
                                  onClick={
                                    () =>
                                      startEditPayment(
                                        payment
                                      )
                                  }
                                >
                                  <Pencil
                                    size={13}
                                  />
                                  Düzenle
                                </button>

                              </div>

                            </div>


                            {editingPayment ===
                              payment.id &&
                              editPaymentForm && (

                              <form
                                onSubmit={
                                  savePaymentEdit
                                }
                                className={styles.paymentEditBox}
                              >

                                <strong>
                                  Tahsilatı Düzenle
                                </strong>


                                <input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={
                                    editPaymentForm.amount
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPaymentForm({
                                        ...editPaymentForm,

                                        amount:
                                          event.target.value,
                                      })
                                  }
                                  required
                                />


                                <input
                                  type="date"
                                  value={
                                    editPaymentForm.payment_date
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPaymentForm({
                                        ...editPaymentForm,

                                        payment_date:
                                          event.target.value,
                                      })
                                  }
                                  required
                                />


                                <select
                                  value={
                                    editPaymentForm.payment_method
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPaymentForm({
                                        ...editPaymentForm,

                                        payment_method:
                                          event.target.value,
                                      })
                                  }
                                >
                                  <option value="Nakit">
                                    Nakit
                                  </option>

                                  <option value="Kart">
                                    Kart
                                  </option>

                                  <option value="Havale/EFT">
                                    Havale/EFT
                                  </option>

                                  <option value="Diğer">
                                    Diğer
                                  </option>
                                </select>


                                <input
                                  placeholder="Ödeme notu"
                                  value={
                                    editPaymentForm.note
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPaymentForm({
                                        ...editPaymentForm,

                                        note:
                                          event.target.value,
                                      })
                                  }
                                />


                                <input
                                  placeholder="Düzeltme / iptal nedeni"
                                  value={
                                    editPaymentForm.reason
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPaymentForm({
                                        ...editPaymentForm,

                                        reason:
                                          event.target.value,
                                      })
                                  }
                                  required
                                />


                                <div className={styles.actionRow}>

                                  <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={
                                      savingPaymentEdit
                                    }
                                  >
                                    <Save
                                      size={15}
                                    />

                                    {savingPaymentEdit
                                      ? "Kaydediliyor..."
                                      : "Değişikliği Kaydet"}
                                  </button>


                                  <button
                                    type="button"
                                    className={styles.dangerButton}
                                    onClick={
                                      deletePayment
                                    }
                                    disabled={
                                      deletingPayment
                                    }
                                  >
                                    <Trash2
                                      size={14}
                                    />

                                    {deletingPayment
                                      ? "İptal ediliyor..."
                                      : "Tahsilatı İptal Et"}
                                  </button>


                                  <button
                                    type="button"
                                    className={styles.ghostButton}
                                    onClick={
                                      () => {
                                        setEditingPayment(
                                          null
                                        );

                                        setEditPaymentForm(
                                          null
                                        );
                                      }
                                    }
                                  >
                                    Vazgeç
                                  </button>

                                </div>

                              </form>

                            )}

                          </div>

                        )
                      )

                    )}

                  </div>

                </section>


                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <ReceiptText
                      size={19}
                    />

                    <strong>
                      Satış Maliyeti / Kâr
                    </strong>

                  </div>


                  <div className="patient-profile-info-grid">

                    <InfoItem
                      label="Satış Bedeli"
                      value={
                        formatMoney(
                          financial.salePrice
                        )
                      }
                    />

                    <InfoItem
                      label="Cihaz Maliyeti"
                      value={
                        formatMoney(
                          financial.purchaseCost
                        )
                      }
                    />

                    <InfoItem
                      label="Brüt Kâr"
                      value={
                        formatMoney(
                          financial.grossProfit
                        )
                      }
                    />

                    <InfoItem
                      label="Brüt Marj"
                      value={
                        `%${financial.grossMargin
                          .toFixed(1)
                          .replace(
                            ".",
                            ","
                          )}`
                      }
                    />

                  </div>


                  <form
                    className="patient-profile-mini-form"
                    onSubmit={
                      saveCost
                    }
                    style={{
                      marginTop:
                        "16px",
                    }}
                  >

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Toplam satış maliyeti"
                      value={
                        costForm.purchase_cost
                      }
                      onChange={
                        (event) =>
                          setCostForm({
                            ...costForm,

                            purchase_cost:
                              event.target.value,
                          })
                      }
                      required
                    />


                    <input
                      placeholder="Düzeltme nedeni"
                      value={
                        costForm.reason
                      }
                      onChange={
                        (event) =>
                          setCostForm({
                            ...costForm,

                            reason:
                              event.target.value,
                          })
                      }
                      required
                    />


                    <button
                      type="submit"
                      className="admin-primary-button"
                      disabled={
                        savingCost
                      }
                    >
                      <Save
                        size={16}
                      />

                      {savingCost
                        ? "Kaydediliyor..."
                        : "Maliyeti Güncelle"}
                    </button>

                  </form>


                  <p className={styles.costHelp}>
                    Bu alan yalnızca bu satışın tarihsel
                    maliyetini değiştirir. Envanterdeki
                    güncel alış fiyatı veya stok miktarı
                    değişmez.
                  </p>

                </section>

              </div>


              <section className={`patient-profile-card ${styles.promiseCard}`}>

                <div className="patient-profile-card-title">

                  <CalendarDays
                    size={19}
                  />

                  <strong>
                    Ödeme Planı / Tahsilat Sözü
                  </strong>

                </div>


                <div className="patient-profile-info-grid"
                  style={{
                    marginBottom:
                      "14px",
                  }}
                >

                  <InfoItem
                    label="Kalan Borç"
                    value={
                      formatMoney(
                        financial.remaining
                      )
                    }
                  />

                  <InfoItem
                    label="Planlanmış Bekleyen"
                    value={
                      formatMoney(
                        openPromiseTotal
                      )
                    }
                  />

                  <InfoItem
                    label="Yeni Planlanabilir"
                    value={
                      formatMoney(
                        unplannedRemaining
                      )
                    }
                  />

                  <InfoItem
                    label="Bekleyen Plan"
                    value={
                      String(
                        promises.filter(
                          (row) =>
                            row.status ===
                            "Bekliyor"
                        ).length
                      )
                    }
                  />

                </div>


                {financial.remaining >
                  0 ? (

                  <form
                    className={styles.promiseTop}
                    onSubmit={
                      savePromise
                    }
                  >

                    <input
                      type="date"
                      value={
                        promiseForm.due_date
                      }
                      onChange={
                        (event) =>
                          setPromiseForm({
                            ...promiseForm,

                            due_date:
                              event.target.value,
                          })
                      }
                      required
                    />


                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={
                        unplannedRemaining ||
                        undefined
                      }
                      placeholder="Beklenen tutar"
                      value={
                        promiseForm.amount
                      }
                      onChange={
                        (event) =>
                          setPromiseForm({
                            ...promiseForm,

                            amount:
                              event.target.value,
                          })
                      }
                      required
                    />


                    <input
                      placeholder="Not (örn. 2. taksit)"
                      value={
                        promiseForm.note
                      }
                      onChange={
                        (event) =>
                          setPromiseForm({
                            ...promiseForm,

                            note:
                              event.target.value,
                          })
                      }
                    />


                    <button
                      type="submit"
                      className="admin-primary-button"
                      disabled={
                        savingPromise ||
                        unplannedRemaining <=
                          0
                      }
                    >
                      {savingPromise
                        ? "Ekleniyor..."
                        : "Ödeme Planı Ekle"}
                    </button>

                  </form>

                ) : (

                  <div className="patient-profile-paid">
                    Kalan borç olmadığı için yeni ödeme planı oluşturulamaz.
                  </div>

                )}


                {promises.length ===
                0 ? (

                  <p className="patient-profile-empty">
                    Henüz ödeme planı bulunmuyor.
                  </p>

                ) : (

                  <div className={styles.promiseList}>

                    {promises.map(
                      (promise) => {
                        const displayStatus =
                          promiseDisplayStatus(
                            promise
                          );


                        const linkedPayment =
                          promise.payment_id
                            ? profile.payments.find(
                                (payment) =>
                                  payment.id ===
                                  promise.payment_id
                              )
                            : null;


                        return (

                          <div
                            className={styles.promiseRow}
                            key={
                              promise.id
                            }
                          >

                            <div className={styles.promiseMain}>

                              <strong>
                                {formatMoney(
                                  promise.amount
                                )}
                                {" • "}
                                {formatDate(
                                  promise.due_date
                                )}
                              </strong>

                              <span>
                                {promise.note ||
                                  "Not eklenmemiş."}
                              </span>


                              <div className={styles.promiseMeta}>

                                <span
                                  className={
                                    promiseStatusClass(
                                      displayStatus
                                    )
                                  }
                                >
                                  {displayStatus}
                                </span>


                                {promise.completed_at && (

                                  <span>
                                    Tamamlanma:{" "}
                                    {formatDateTime(
                                      promise.completed_at
                                    )}
                                  </span>

                                )}

                              </div>

                            </div>


                            <div className={styles.promiseActions}>

                              {promise.status ===
                                "Bekliyor" && (

                                <>

                                  <button
                                    type="button"
                                    className={styles.successButton}
                                    onClick={
                                      () =>
                                        selectPromiseForCollection(
                                          promise
                                        )
                                    }
                                  >
                                    <Wallet
                                      size={13}
                                    />
                                    Tahsil Et
                                  </button>


                                  <button
                                    type="button"
                                    className={styles.miniButton}
                                    onClick={
                                      () =>
                                        startEditPromise(
                                          promise
                                        )
                                    }
                                  >
                                    <Pencil
                                      size={13}
                                    />
                                    Düzenle
                                  </button>


                                  <button
                                    type="button"
                                    className={styles.dangerButton}
                                    disabled={
                                      promiseActionId ===
                                      promise.id
                                    }
                                    onClick={
                                      () =>
                                        cancelPromise(
                                          promise
                                        )
                                    }
                                  >
                                    <Trash2
                                      size={13}
                                    />
                                    İptal
                                  </button>

                                </>

                              )}


                              {linkedPayment && (

                                <button
                                  type="button"
                                  className={styles.receiptButton}
                                  onClick={
                                    () =>
                                      printReceipt(
                                        linkedPayment
                                      )
                                  }
                                >
                                  <Printer
                                    size={13}
                                  />
                                  Makbuz
                                </button>

                              )}

                            </div>


                            {editingPromise ===
                              promise.id &&
                              editPromiseForm && (

                              <form
                                className={styles.promiseEdit}
                                onSubmit={
                                  savePromiseEdit
                                }
                              >

                                <input
                                  type="date"
                                  value={
                                    editPromiseForm.due_date
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPromiseForm({
                                        ...editPromiseForm,

                                        due_date:
                                          event.target.value,
                                      })
                                  }
                                  required
                                />


                                <input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={
                                    editPromiseForm.amount
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPromiseForm({
                                        ...editPromiseForm,

                                        amount:
                                          event.target.value,
                                      })
                                  }
                                  required
                                />


                                <input
                                  value={
                                    editPromiseForm.note
                                  }
                                  onChange={
                                    (event) =>
                                      setEditPromiseForm({
                                        ...editPromiseForm,

                                        note:
                                          event.target.value,
                                      })
                                  }
                                  placeholder="Not"
                                />


                                <div className={styles.actionRow}>

                                  <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={
                                      promiseActionId ===
                                      promise.id
                                    }
                                  >
                                    Kaydet
                                  </button>


                                  <button
                                    type="button"
                                    className={styles.ghostButton}
                                    onClick={
                                      () => {
                                        setEditingPromise(
                                          null
                                        );

                                        setEditPromiseForm(
                                          null
                                        );
                                      }
                                    }
                                  >
                                    Vazgeç
                                  </button>

                                </div>

                              </form>

                            )}

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              </section>


              <div className="patient-profile-two-column">

                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <CalendarDays
                      size={19}
                    />

                    <strong>
                      Kontrol / Randevu
                    </strong>

                  </div>


                  <form
                    className="patient-profile-mini-form"
                    onSubmit={
                      saveAppointment
                    }
                  >

                    <input
                      type="datetime-local"
                      value={
                        appointmentForm.appointment_at
                      }
                      onChange={
                        (event) =>
                          setAppointmentForm({
                            ...appointmentForm,

                            appointment_at:
                              event.target.value,
                          })
                      }
                      required
                    />


                    <select
                      value={
                        appointmentForm.appointment_type
                      }
                      onChange={
                        (event) =>
                          setAppointmentForm({
                            ...appointmentForm,

                            appointment_type:
                              event.target.value,
                          })
                      }
                    >
                      <option>
                        Kontrol
                      </option>

                      <option>
                        Ayar
                      </option>

                      <option>
                        Bakım
                      </option>

                      <option>
                        Teslim
                      </option>

                      <option>
                        Telefon Görüşmesi
                      </option>

                      <option>
                        Diğer
                      </option>
                    </select>


                    <input
                      placeholder="Not"
                      value={
                        appointmentForm.notes
                      }
                      onChange={
                        (event) =>
                          setAppointmentForm({
                            ...appointmentForm,

                            notes:
                              event.target.value,
                          })
                      }
                    />


                    <button
                      type="submit"
                      className="admin-primary-button"
                      disabled={
                        savingAppointment
                      }
                    >
                      <CalendarDays
                        size={16}
                      />

                      {savingAppointment
                        ? "Kaydediliyor..."
                        : "Randevu Ekle"}
                    </button>

                  </form>


                  <div className="patient-profile-history">

                    <h4>
                      Kontrol Geçmişi
                    </h4>


                    {profile.appointments
                      .length ===
                    0 ? (

                      <p className="patient-profile-empty">
                        Henüz kontrol/randevu yok.
                      </p>

                    ) : (

                      profile.appointments.map(
                        (
                          appointment
                        ) => (

                          <div
                            className="patient-profile-history-row"
                            key={
                              appointment.id
                            }
                          >

                            <div>

                              <strong>
                                {
                                  appointment.appointment_type
                                }
                              </strong>

                              <span>
                                {appointment.notes ||
                                  ""}
                              </span>

                            </div>


                            <div>

                              <strong>
                                {formatDateTime(
                                  appointment.appointment_at
                                )}
                              </strong>

                              <span
                                className={
                                  `admin-badge ${
                                    appointment.status ===
                                    "Tamamlandı"
                                      ? "green"
                                      : appointment.status ===
                                        "İptal"
                                        ? "gray"
                                        : "blue"
                                  }`
                                }
                              >
                                {
                                  appointment.status
                                }
                              </span>

                            </div>

                          </div>

                        )
                      )

                    )}

                  </div>

                </section>


                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <History
                      size={19}
                    />

                    <strong>
                      Finans İşlem Geçmişi
                    </strong>

                  </div>


                  {auditLogs.length ===
                  0 ? (

                    <p className="patient-profile-empty">
                      Henüz finansal düzeltme kaydı yok.
                    </p>

                  ) : (

                    <div className="patient-profile-history">

                      {auditLogs.map(
                        (row) => (

                          <div
                            className="patient-profile-history-row"
                            key={
                              row.id
                            }
                          >

                            <div>

                              <strong>
                                {getAuditTitle(
                                  row
                                )}
                              </strong>

                              <span>
                                {getAuditDifference(
                                  row
                                )}
                              </span>

                              <span>
                                Neden:{" "}
                                {
                                  row.reason
                                }
                              </span>

                            </div>


                            <div>

                              <strong>
                                {formatDateTime(
                                  row.created_at
                                )}
                              </strong>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </section>

              </div>


              <section className="patient-profile-card">

                <div className="patient-profile-card-title">

                  <Wrench
                    size={19}
                  />

                  <strong>
                    Tamir / Servis Geçmişi
                  </strong>

                </div>


                {profile.repairs.length ===
                0 ? (

                  <p className="patient-profile-empty">
                    Bu hastaya ait tamir kaydı bulunmuyor.
                  </p>

                ) : (

                  <div className="admin-table-wrap">

                    <table className="admin-table">

                      <thead>

                        <tr>

                          <th>
                            Cihaz
                          </th>

                          <th>
                            Tarih
                          </th>

                          <th>
                            Durum
                          </th>

                          <th>
                            Açıklama
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {profile.repairs.map(
                          (repair) => (

                            <tr
                              key={
                                repair.id
                              }
                            >

                              <td>
                                {repair.device_name ||
                                  "—"}
                              </td>

                              <td>
                                {formatDate(
                                  repair.sent_date
                                )}
                              </td>

                              <td>
                                {
                                  repair.status
                                }
                              </td>

                              <td>
                                {repair.description ||
                                  "—"}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>


              {(profile.patient.address ||
                profile.patient.notes) && (

                <section className="patient-profile-card">

                  <div className="patient-profile-card-title">

                    <FileText
                      size={19}
                    />

                    <strong>
                      Hasta Notları
                    </strong>

                  </div>


                  {profile.patient
                    .address && (

                    <div className="patient-profile-note">

                      <strong>
                        Adres
                      </strong>

                      <p>
                        {
                          profile.patient
                            .address
                        }
                      </p>

                    </div>

                  )}


                  {profile.patient
                    .notes && (

                    <div className="patient-profile-note">

                      <strong>
                        Not
                      </strong>

                      <p>
                        {
                          profile.patient
                            .notes
                        }
                      </p>

                    </div>

                  )}

                </section>

              )}

            </>

          )}

        </div>

      </section>

    </div>
  );
}
