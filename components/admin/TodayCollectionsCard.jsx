"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  RefreshCw,
  Wallet,
} from "lucide-react";

import styles from "./FinanceExtras.module.css";


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

          ...(options.headers || {}),
        },

        cache: "no-store",
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
        "Tahsilat planları alınamadı."
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
      `${value}T12:00:00`
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


export default function TodayCollectionsCard({
  onOpenProfile,
  refreshKey = 0,
}) {
  const [
    data,
    setData,
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


  useEffect(
    () => {
      load();
    },
    [refreshKey]
  );


  async function load() {
    setLoading(true);
    setError("");


    try {
      const result =
        await requestJson(
          "/api/admin/payment-promises?scope=dashboard"
        );


      setData(result);

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  }


  const totals =
    data?.totals || {
      todayCount: 0,
      todayAmount: 0,
      overdueCount: 0,
      overdueAmount: 0,
    };


  return (
    <section
      className={`admin-card ${styles.collectionsCard}`}
    >

      <div className="admin-card-head">

        <div className="admin-card-title">

          <Wallet size={19} />

          <strong>
            Tahsilat Takibi
          </strong>

        </div>


        <button
          type="button"
          className={styles.refreshButton}
          onClick={load}
          disabled={loading}
        >
          <RefreshCw
            size={13}
          />

          Yenile
        </button>

      </div>


      <div className={styles.collectionsSummary}>

        <article>

          <span>
            Bugün Beklenen
          </span>

          <strong>
            {totals.todayCount}
          </strong>

        </article>


        <article>

          <span>
            Bugünkü Tutar
          </span>

          <strong>
            {formatMoney(
              totals.todayAmount
            )}
          </strong>

        </article>


        <article className={styles.danger}>

          <span>
            Geciken Ödeme
          </span>

          <strong>
            {totals.overdueCount}
          </strong>

        </article>


        <article className={styles.danger}>

          <span>
            Geciken Tutar
          </span>

          <strong>
            {formatMoney(
              totals.overdueAmount
            )}
          </strong>

        </article>

      </div>


      {loading ? (

        <div className={styles.collectionsEmpty}>
          Tahsilat planları yükleniyor...
        </div>

      ) : error ? (

        <div className="admin-form-error">
          {error}
        </div>

      ) : (

        <>

          {data?.overdue?.length >
            0 && (

            <div className={styles.collectionSection}>

              <div className={styles.collectionSectionTitle}>

                <AlertTriangle
                  size={15}
                />

                Geciken Tahsilatlar

              </div>


              <div className={styles.collectionList}>

                {data.overdue.map(
                  (row) => (

                    <button
                      type="button"
                      key={row.id}
                      className={`${styles.collectionRow} ${styles.collectionRowLate}`}
                      onClick={
                        () =>
                          onOpenProfile?.(
                            row.patient_id
                          )
                      }
                    >

                      <span className={styles.collectionPatient}>

                        <strong>
                          {row.patient?.full_name ||
                            "Hasta"}
                        </strong>

                        <small>
                          {row.note ||
                            row.patient?.phone ||
                            "Ödeme planı"}
                        </small>

                      </span>


                      <span className={styles.collectionAmount}>

                        <strong>
                          {formatMoney(
                            row.amount
                          )}
                        </strong>

                        <small>
                          Beklenen tahsilat
                        </small>

                      </span>


                      <span className={styles.collectionDate}>
                        {formatDate(
                          row.due_date
                        )}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}


          <div className={styles.collectionSection}>

            <div className={styles.collectionSectionTitle}>

              <Wallet
                size={15}
              />

              Bugün Tahsilat Beklenenler

            </div>


            {data?.today?.length >
            0 ? (

              <div className={styles.collectionList}>

                {data.today.map(
                  (row) => (

                    <button
                      type="button"
                      key={row.id}
                      className={styles.collectionRow}
                      onClick={
                        () =>
                          onOpenProfile?.(
                            row.patient_id
                          )
                      }
                    >

                      <span className={styles.collectionPatient}>

                        <strong>
                          {row.patient?.full_name ||
                            "Hasta"}
                        </strong>

                        <small>
                          {row.note ||
                            row.patient?.phone ||
                            "Ödeme planı"}
                        </small>

                      </span>


                      <span className={styles.collectionAmount}>

                        <strong>
                          {formatMoney(
                            row.amount
                          )}
                        </strong>

                        <small>
                          Bugün bekleniyor
                        </small>

                      </span>


                      <span className={styles.collectionDate}>
                        {formatDate(
                          row.due_date
                        )}
                      </span>

                    </button>

                  )
                )}

              </div>

            ) : (

              <div className={styles.collectionsEmpty}>
                Bugün için beklenen tahsilat bulunmuyor.
              </div>

            )}

          </div>

        </>

      )}

    </section>
  );
}
