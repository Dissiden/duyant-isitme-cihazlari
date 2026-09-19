"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  FileText,
  HeartPulse,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wallet,
  Wrench,
  X,
} from "lucide-react";


const EMPTY_PAYMENT = {
  amount: "",
  payment_date:
    new Date()
      .toISOString()
      .slice(0, 10),

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
      value.includes("T")
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
    "Kısmi"
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
    savingPayment,
    setSavingPayment,
  ] =
    useState(false);


  const [
    savingAppointment,
    setSavingAppointment,
  ] =
    useState(false);


  useEffect(
    () => {
      loadProfile();
    },
    [patientId]
  );


  async function loadProfile() {
    if (!patientId) {
      return;
    }


    setLoading(true);
    setError("");


    try {
      const data =
        await requestJson(
          `/api/admin/data?resource=patient-profile&id=${encodeURIComponent(
            patientId
          )}`
        );


      setProfile(data);

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  }


  async function savePayment(
    event
  ) {
    event.preventDefault();

    setSavingPayment(true);
    setError("");


    try {
      await requestJson(
        "/api/admin/data",
        {
          method: "POST",

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


      setPaymentForm({
        ...EMPTY_PAYMENT,

        payment_date:
          new Date()
            .toISOString()
            .slice(
              0,
              10
            ),
      });


      await loadProfile();

      if (onChanged) {
        onChanged();
      }

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
          method: "POST",

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


      await loadProfile();

      if (onChanged) {
        onChanged();
      }

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
              {profile?.patient?.full_name ||
                "Hasta"}
            </h2>

            <p>
              Hasta, cihaz, ödeme,
              kontrol ve servis geçmişi.
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
              onClick={onClose}
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
                      {profile.patient.full_name}
                    </h3>

                    <p>
                      TC:{" "}
                      {profile.patient.tc_identity}
                    </p>

                    {profile.patient.phone && (

                      <a
                        href={`tel:${profile.patient.phone}`}
                      >
                        <Phone
                          size={14}
                        />

                        {profile.patient.phone}
                      </a>

                    )}

                  </div>

                </div>


                <div className="patient-profile-statuses">

                  <span
                    className={
                      `admin-badge ${
                        profile.patient.report_status ===
                        "Raporlu"
                          ? "green"
                          : "gray"
                      }`
                    }
                  >
                    {profile.patient.report_status}
                  </span>


                  <span
                    className={
                      `admin-badge ${
                        profile.patient.institution_status ===
                        "Kurumlu"
                          ? "blue"
                          : "gray"
                      }`
                    }
                  >
                    {profile.patient.institution_status}
                  </span>

                </div>

              </section>


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
                        profile.patient.device_name
                      }
                    />

                    <InfoItem
                      label="Taraf"
                      value={
                        profile.patient.device_side
                      }
                    />

                    <InfoItem
                      label="Sağ Seri No"
                      value={
                        profile.patient.right_serial_number
                      }
                    />

                    <InfoItem
                      label="Sol Seri No"
                      value={
                        profile.patient.left_serial_number
                      }
                    />

                    <InfoItem
                      label="Tip"
                      value={
                        profile.patient.power_type
                      }
                    />

                    <InfoItem
                      label="Pil No"
                      value={
                        profile.patient.power_type ===
                        "Pilli"
                          ? profile.patient.battery_size
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
                          profile.patient.purchase_date
                        )
                      }
                    />

                    <InfoItem
                      label="Satış Bedeli"
                      value={
                        formatMoney(
                          profile.financial.salePrice
                        )
                      }
                    />

                    <InfoItem
                      label="Garanti Başlangıç"
                      value={
                        formatDate(
                          profile.patient.warranty_start_date
                        )
                      }
                    />

                    <InfoItem
                      label="Garanti Bitiş"
                      value={
                        formatDate(
                          profile.patient.warranty_end_date
                        )
                      }
                    />

                  </div>

                </section>

              </div>


              <section className="patient-profile-financial">

                <article>

                  <span>
                    Satış Bedeli
                  </span>

                  <strong>
                    {formatMoney(
                      profile.financial.salePrice
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Toplam Tahsilat
                  </span>

                  <strong>
                    {formatMoney(
                      profile.financial.totalPaid
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Kalan
                  </span>

                  <strong>
                    {formatMoney(
                      profile.financial.remaining
                    )}
                  </strong>

                </article>


                <article>

                  <span>
                    Ödeme Durumu
                  </span>

                  <strong>

                    <span
                      className={
                        `admin-badge ${paymentClass(
                          profile.financial.status
                        )}`
                      }
                    >
                      {profile.financial.status}
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
                      Tahsilat Ekle
                    </strong>

                  </div>


                  {profile.financial.remaining >
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


                    {profile.payments.length ===
                    0 ? (

                      <p className="patient-profile-empty">
                        Henüz tahsilat yok.
                      </p>

                    ) : (

                      profile.payments.map(
                        (payment) => (

                          <div
                            className="patient-profile-history-row"
                            key={
                              payment.id
                            }
                          >

                            <div>

                              <strong>
                                {formatMoney(
                                  payment.amount
                                )}
                              </strong>

                              <span>
                                {payment.payment_method}
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

                          </div>

                        )
                      )

                    )}

                  </div>

                </section>


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


                    {profile.appointments.length ===
                    0 ? (

                      <p className="patient-profile-empty">
                        Henüz kontrol/randevu yok.
                      </p>

                    ) : (

                      profile.appointments.map(
                        (appointment) => (

                          <div
                            className="patient-profile-history-row"
                            key={
                              appointment.id
                            }
                          >

                            <div>

                              <strong>
                                {appointment.appointment_type}
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
                                {appointment.status}
                              </span>

                            </div>

                          </div>

                        )
                      )

                    )}

                  </div>

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
                                {repair.status}
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


                  {profile.patient.address && (

                    <div className="patient-profile-note">

                      <strong>
                        Adres
                      </strong>

                      <p>
                        {profile.patient.address}
                      </p>

                    </div>

                  )}


                  {profile.patient.notes && (

                    <div className="patient-profile-note">

                      <strong>
                        Not
                      </strong>

                      <p>
                        {profile.patient.notes}
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