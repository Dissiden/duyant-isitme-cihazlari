"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";


function formatTime(
  value
) {
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
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


export default function TodayAppointmentsCard({
  onOpenProfile,
  onOpenAppointments,
  refreshKey = 0,
}) {
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


  useEffect(
    () => {
      load();
    },
    [refreshKey]
  );


  async function load() {
    setLoading(true);


    try {
      const response =
        await fetch(
          "/api/admin/appointments?range=today",
          {
            cache:
              "no-store",
          }
        );


      const data =
        await response.json();


      if (
        response.ok
      ) {
        setRows(
          data.rows || []
        );
      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="admin-card today-appointments-card">

      <div className="admin-card-head">

        <div className="admin-card-title">

          <CalendarDays
            size={19}
          />

          <strong>
            Bugünkü Randevular
          </strong>

        </div>


        <button
          type="button"
          className="admin-outline-button"
          onClick={
            onOpenAppointments
          }
        >
          Tümünü Gör
        </button>

      </div>


      {loading ? (

        <div className="admin-loading-card">
          Randevular yükleniyor...
        </div>

      ) : rows.length ===
      0 ? (

        <div className="admin-empty">
          Bugün planlanmış randevu yok.
        </div>

      ) : (

        <div className="today-appointments-list">

          {rows.map(
            (row) => (

              <button
                type="button"
                key={row.id}
                onClick={
                  () =>
                    row.patient &&
                    onOpenProfile?.(
                      row.patient.id
                    )
                }
              >

                <span className="today-appointment-time">

                  <Clock3
                    size={15}
                  />

                  {formatTime(
                    row.appointment_at
                  )}

                </span>


                <span className="today-appointment-patient">

                  <strong>
                    {row.patient?.full_name ||
                      "Hasta"}
                  </strong>

                  <small>
                    {row.appointment_type}

                    {row.patient?.device_name
                      ? ` • ${row.patient.device_name}`
                      : ""}
                  </small>

                </span>

              </button>

            )
          )}

        </div>

      )}

    </section>
  );
}