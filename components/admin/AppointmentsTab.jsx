"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarCheck,
  CalendarDays,
  Check,
  Clock3,
  Plus,
  Search,
  UserRound,
  X,
  XCircle,
} from "lucide-react";


const EMPTY_FORM = {
  patient_id: "",
  appointment_at: "",
  appointment_type:
    "Kontrol",
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


function formatDateTime(
  value
) {
  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


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


function badgeClass(
  status
) {
  if (
    status ===
    "Tamamlandı"
  ) {
    return "green";
  }


  if (
    status ===
    "İptal"
  ) {
    return "gray";
  }


  return "blue";
}


export default function AppointmentsTab({
  onChanged,
  onOpenProfile,
}) {
  const [
    range,
    setRange,
  ] =
    useState(
      "today"
    );


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    rows,
    setRows,
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
    modalOpen,
    setModalOpen,
  ] =
    useState(false);


  const [
    form,
    setForm,
  ] =
    useState({
      ...EMPTY_FORM,
    });


  const [
    patientSearch,
    setPatientSearch,
  ] =
    useState("");


  const [
    patientResults,
    setPatientResults,
  ] =
    useState([]);


  const [
    selectedPatient,
    setSelectedPatient,
  ] =
    useState(null);


  const [
    patientSearching,
    setPatientSearching,
  ] =
    useState(false);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  useEffect(
    () => {
      loadAppointments();
    },
    [range]
  );


  async function loadAppointments(
    query = search
  ) {
    setLoading(true);
    setError("");


    try {
      const data =
        await requestJson(
          `/api/admin/appointments?range=${encodeURIComponent(
            range
          )}&q=${encodeURIComponent(
            query || ""
          )}`
        );


      setRows(
        data.rows || []
      );

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  }


  async function searchPatients(
    event
  ) {
    event?.preventDefault();


    const q =
      patientSearch.trim();


    if (!q) {
      setPatientResults(
        []
      );

      return;
    }


    setPatientSearching(
      true
    );

    setError("");


    try {
      const data =
        await requestJson(
          `/api/admin/data?resource=patients&q=${encodeURIComponent(
            q
          )}`
        );


      setPatientResults(
        (
          data.rows || []
        ).slice(
          0,
          10
        )
      );

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setPatientSearching(
        false
      );
    }
  }


  function choosePatient(
    patient
  ) {
    setSelectedPatient(
      patient
    );


    setForm(
      (current) => ({
        ...current,

        patient_id:
          patient.id,
      })
    );


    setPatientResults(
      []
    );
  }


  function openNewAppointment() {
    setForm({
      ...EMPTY_FORM,
    });

    setSelectedPatient(
      null
    );

    setPatientSearch(
      ""
    );

    setPatientResults(
      []
    );

    setError("");

    setModalOpen(
      true
    );
  }


  async function saveAppointment(
    event
  ) {
    event.preventDefault();


    if (
      !selectedPatient
    ) {
      setError(
        "Önce hasta seçmelisiniz."
      );

      return;
    }


    setSaving(true);
    setError("");


    try {
      await requestJson(
        "/api/admin/appointments",
        {
          method: "POST",

          body:
            JSON.stringify({
              action:
                "create",

              data:
                form,
            }),
        }
      );


      setModalOpen(
        false
      );


      await loadAppointments(
        ""
      );


      if (onChanged) {
        await onChanged();
      }

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSaving(false);
    }
  }


  async function changeStatus(
    id,
    status
  ) {
    setError("");


    try {
      await requestJson(
        "/api/admin/appointments",
        {
          method: "POST",

          body:
            JSON.stringify({
              action:
                "status",

              data: {
                id,
                status,
              },
            }),
        }
      );


      await loadAppointments();


      if (onChanged) {
        await onChanged();
      }

    } catch (err) {
      setError(
        err.message
      );
    }
  }


  function submitSearch(
    event
  ) {
    event.preventDefault();

    loadAppointments(
      search
    );
  }


  return (
    <>

      <div className="admin-page-head">

        <div>

          <span>
            DuyAnt Yönetim
          </span>

          <h1>
            Randevular
          </h1>

          <p>
            Kontrol, ayar, bakım ve
            teslim randevularını takip edin.
          </p>

        </div>


        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openNewAppointment
          }
        >
          <Plus size={17} />

          Yeni Randevu
        </button>

      </div>


      <div className="appointment-filter-grid">

        <button
          type="button"
          className={
            range ===
            "today"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setRange(
                "today"
              )
          }
        >
          <CalendarDays
            size={18}
          />

          Bugün
        </button>


        <button
          type="button"
          className={
            range ===
            "upcoming"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setRange(
                "upcoming"
              )
          }
        >
          <Clock3
            size={18}
          />

          Yaklaşan
        </button>


        <button
          type="button"
          className={
            range ===
            "all"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setRange(
                "all"
              )
          }
        >
          <CalendarCheck
            size={18}
          />

          Tümü
        </button>


        <button
          type="button"
          className={
            range ===
            "completed"
              ? "active"
              : ""
          }
          onClick={
            () =>
              setRange(
                "completed"
              )
          }
        >
          <Check
            size={18}
          />

          Tamamlananlar
        </button>

      </div>


      <section className="admin-card admin-list-card">

        <form
          className="admin-list-search"
          onSubmit={
            submitSearch
          }
        >

          <Search size={18} />

          <input
            value={search}
            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }
            placeholder="Hasta, TC, telefon, cihaz veya randevu türü ara..."
          />

          <button
            type="submit"
          >
            Ara
          </button>

        </form>


        {error && (
          <div className="admin-form-error appointment-error">
            {error}
          </div>
        )}


        {loading ? (

          <div className="admin-loading-card">
            Randevular yükleniyor...
          </div>

        ) : rows.length ===
        0 ? (

          <div className="admin-empty">
            Bu bölümde randevu bulunamadı.
          </div>

        ) : (

          <div className="admin-table-wrap">

            <table className="admin-table large appointment-table">

              <thead>

                <tr>

                  <th>
                    Tarih / Saat
                  </th>

                  <th>
                    Hasta
                  </th>

                  <th>
                    TC
                  </th>

                  <th>
                    Telefon
                  </th>

                  <th>
                    Cihaz
                  </th>

                  <th>
                    İşlem
                  </th>

                  <th>
                    Not
                  </th>

                  <th>
                    Durum
                  </th>

                  <th>
                    İşlem
                  </th>

                </tr>

              </thead>


              <tbody>

                {rows.map(
                  (row) => (

                    <tr key={row.id}>

                      <td>
                        <strong>
                          {formatDateTime(
                            row.appointment_at
                          )}
                        </strong>
                      </td>


                      <td>

                        {row.patient ? (

                          <button
                            type="button"
                            className="admin-name-link"
                            onClick={
                              () =>
                                onOpenProfile?.(
                                  row.patient.id
                                )
                            }
                          >
                            {row.patient.full_name}
                          </button>

                        ) : (
                          "Hasta bulunamadı"
                        )}

                      </td>


                      <td>
                        {row.patient?.tc_identity ||
                          "—"}
                      </td>


                      <td>
                        {row.patient?.phone ||
                          "—"}
                      </td>


                      <td>
                        {row.patient?.device_name ||
                          "—"}
                      </td>


                      <td>
                        {row.appointment_type}
                      </td>


                      <td className="admin-description-cell">
                        {row.notes ||
                          "—"}
                      </td>


                      <td>

                        <span
                          className={
                            `admin-badge ${badgeClass(
                              row.status
                            )}`
                          }
                        >
                          {row.status}
                        </span>

                      </td>


                      <td>

                        {row.status ===
                        "Planlandı" ? (

                          <div className="appointment-row-actions">

                            <button
                              type="button"
                              className="appointment-complete-button"
                              onClick={
                                () =>
                                  changeStatus(
                                    row.id,
                                    "Tamamlandı"
                                  )
                              }
                              title="Tamamlandı"
                            >
                              <Check
                                size={15}
                              />
                            </button>


                            <button
                              type="button"
                              className="appointment-cancel-button"
                              onClick={
                                () =>
                                  changeStatus(
                                    row.id,
                                    "İptal"
                                  )
                              }
                              title="İptal"
                            >
                              <XCircle
                                size={15}
                              />
                            </button>

                          </div>

                        ) : (

                          <button
                            type="button"
                            className="appointment-restore-button"
                            onClick={
                              () =>
                                changeStatus(
                                  row.id,
                                  "Planlandı"
                                )
                            }
                          >
                            Geri Al
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {modalOpen && (

        <div
          className="admin-modal-backdrop"
          onMouseDown={
            () =>
              setModalOpen(
                false
              )
          }
        >

          <section
            className="admin-modal appointment-new-modal"
            onMouseDown={
              (event) =>
                event.stopPropagation()
            }
          >

            <header className="admin-modal-head">

              <div>

                <h2>
                  Yeni Randevu
                </h2>

                <p>
                  Önce hastayı bulun,
                  sonra randevu tarihini belirleyin.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  () =>
                    setModalOpen(
                      false
                    )
                }
              >
                <X size={20} />
              </button>

            </header>


            <div className="appointment-modal-body">

              {!selectedPatient ? (

                <>

                  <form
                    className="appointment-patient-search"
                    onSubmit={
                      searchPatients
                    }
                  >

                    <Search
                      size={18}
                    />

                    <input
                      value={
                        patientSearch
                      }
                      onChange={
                        (event) =>
                          setPatientSearch(
                            event.target.value
                          )
                      }
                      placeholder="TC, ad soyad veya telefon..."
                    />

                    <button
                      type="submit"
                    >
                      {patientSearching
                        ? "Aranıyor..."
                        : "Hastayı Bul"}
                    </button>

                  </form>


                  {patientResults.length >
                  0 && (

                    <div className="appointment-patient-results">

                      {patientResults.map(
                        (patient) => (

                          <button
                            type="button"
                            key={
                              patient.id
                            }
                            onClick={
                              () =>
                                choosePatient(
                                  patient
                                )
                            }
                          >

                            <span className="appointment-patient-icon">
                              <UserRound
                                size={18}
                              />
                            </span>


                            <span>

                              <strong>
                                {patient.full_name}
                              </strong>

                              <small>
                                TC:{" "}
                                {patient.tc_identity}
                                {" • "}
                                {patient.phone ||
                                  "Telefon yok"}
                              </small>

                              <small>
                                {patient.device_name ||
                                  "Cihaz bilgisi yok"}
                              </small>

                            </span>

                          </button>

                        )
                      )}

                    </div>

                  )}

                </>

              ) : (

                <div className="appointment-selected-patient">

                  <div>

                    <UserRound
                      size={20}
                    />

                    <span>

                      <strong>
                        {selectedPatient.full_name}
                      </strong>

                      <small>
                        TC:{" "}
                        {selectedPatient.tc_identity}
                      </small>

                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={
                      () => {
                        setSelectedPatient(
                          null
                        );

                        setForm({
                          ...EMPTY_FORM,
                        });
                      }
                    }
                  >
                    Hastayı Değiştir
                  </button>

                </div>

              )}


              <form
                className="admin-form appointment-create-form"
                onSubmit={
                  saveAppointment
                }
              >

                <div className="admin-form-grid">

                  <label className="admin-field">

                    <span>
                      Tarih / Saat
                    </span>

                    <input
                      type="datetime-local"
                      value={
                        form.appointment_at
                      }
                      onChange={
                        (event) =>
                          setForm({
                            ...form,

                            appointment_at:
                              event.target.value,
                          })
                      }
                      required
                    />

                  </label>


                  <label className="admin-field">

                    <span>
                      Randevu Türü
                    </span>

                    <select
                      value={
                        form.appointment_type
                      }
                      onChange={
                        (event) =>
                          setForm({
                            ...form,

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

                  </label>


                  <label className="admin-field full">

                    <span>
                      Not
                    </span>

                    <textarea
                      rows={4}
                      value={
                        form.notes
                      }
                      onChange={
                        (event) =>
                          setForm({
                            ...form,

                            notes:
                              event.target.value,
                          })
                      }
                      placeholder="Örn. 1 aylık cihaz kontrolü..."
                    />

                  </label>

                </div>


                {error && (
                  <div className="admin-form-error">
                    {error}
                  </div>
                )}


                <div className="admin-form-actions">

                  <button
                    type="button"
                    className="admin-cancel-button"
                    onClick={
                      () =>
                        setModalOpen(
                          false
                        )
                    }
                  >
                    Vazgeç
                  </button>


                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={
                      saving ||
                      !selectedPatient
                    }
                  >
                    {saving
                      ? "Kaydediliyor..."
                      : "Randevuyu Kaydet"}
                  </button>

                </div>

              </form>

            </div>

          </section>

        </div>

      )}

    </>
  );
}