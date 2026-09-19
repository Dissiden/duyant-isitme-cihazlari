"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  BarChart3,
  CalendarDays,
  CreditCard,
  Landmark,
  PackageCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";


async function requestJson(
  url
) {
  const response =
    await fetch(
      url,
      {
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
        "Rapor alınamadı."
    );
  }


  return data;
}


function formatMoney(
  value
) {
  return (
    `${new Intl.NumberFormat(
      "tr-TR",
      {
        maximumFractionDigits: 0,
      }
    ).format(
      Number(
        value || 0
      )
    )} TL`
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
    "tr-TR"
  ).format(date);
}


function statusClass(
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


function currentMonth() {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Europe/Istanbul",

        year: "numeric",
        month: "2-digit",
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


export default function ReportsTab({
  onOpenProfile,
}) {
  const [
    month,
    setMonth,
  ] =
    useState(
      currentMonth()
    );


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
      loadReports();
    },
    [month]
  );


  async function loadReports() {
    setLoading(true);
    setError("");


    try {
      const result =
        await requestJson(
          `/api/admin/reports?month=${encodeURIComponent(
            month
          )}`
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


  const monthLabel =
    useMemo(
      () => {
        const [
          year,
          monthNumber,
        ] =
          month.split(
            "-"
          );


        const date =
          new Date(
            Number(year),
            Number(monthNumber) -
              1,
            1
          );


        return new Intl.DateTimeFormat(
          "tr-TR",
          {
            month: "long",
            year: "numeric",
          }
        ).format(date);
      },
      [month]
    );


  const metrics =
    data?.metrics || {
      todaySalesRevenue: 0,
      todayDeviceCount: 0,
      todayCollections: 0,

      monthRevenue: 0,
      monthDeviceCount: 0,
      monthCollections: 0,

      monthPurchaseCost: 0,
      monthGrossProfit: 0,

      totalReceivable: 0,
    };


  return (
    <>

      <div className="admin-page-head reports-page-head">

        <div>

          <span>
            DuyAnt Yönetim
          </span>

          <h1>
            Kasa / Raporlar
          </h1>

          <p>
            Satış, tahsilat, alacak
            ve brüt kâr durumunu takip edin.
          </p>

        </div>


        <label className="reports-month-picker">

          <span>
            Rapor Ayı
          </span>

          <input
            type="month"
            value={month}
            onChange={
              (event) =>
                setMonth(
                  event.target.value
                )
            }
          />

        </label>

      </div>


      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}


      {loading ? (

        <div className="admin-loading-card">
          Raporlar hazırlanıyor...
        </div>

      ) : (

        <>

          <div className="reports-today-title">

            <CalendarDays
              size={18}
            />

            <strong>
              Bugün
            </strong>

          </div>


          <div className="reports-metric-grid reports-metric-grid-today">

            <article className="reports-metric-card">

              <span className="reports-metric-icon blue">
                <TrendingUp
                  size={21}
                />
              </span>

              <div>

                <small>
                  Bugünkü Satış
                </small>

                <strong>
                  {formatMoney(
                    metrics.todaySalesRevenue
                  )}
                </strong>

                <p>
                  {metrics.todayDeviceCount}
                  {" "}cihaz
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon green">
                <Banknote
                  size={21}
                />
              </span>

              <div>

                <small>
                  Bugünkü Tahsilat
                </small>

                <strong>
                  {formatMoney(
                    metrics.todayCollections
                  )}
                </strong>

                <p>
                  Nakit + kart + havale
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon orange">
                <Wallet
                  size={21}
                />
              </span>

              <div>

                <small>
                  Toplam Alacak
                </small>

                <strong>
                  {formatMoney(
                    metrics.totalReceivable
                  )}
                </strong>

                <p>
                  Tüm açık hasta bakiyeleri
                </p>

              </div>

            </article>

          </div>


          <div className="reports-period-title">

            <BarChart3
              size={18}
            />

            <strong>
              {monthLabel}
            </strong>

          </div>


          <div className="reports-metric-grid">

            <article className="reports-metric-card">

              <span className="reports-metric-icon blue">
                <TrendingUp
                  size={21}
                />
              </span>

              <div>

                <small>
                  Aylık Ciro
                </small>

                <strong>
                  {formatMoney(
                    metrics.monthRevenue
                  )}
                </strong>

                <p>
                  {metrics.monthDeviceCount}
                  {" "}cihaz satışı
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon teal">
                <CreditCard
                  size={21}
                />
              </span>

              <div>

                <small>
                  Aylık Tahsilat
                </small>

                <strong>
                  {formatMoney(
                    metrics.monthCollections
                  )}
                </strong>

                <p>
                  Girilen tahsilatlar
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon purple">
                <PackageCheck
                  size={21}
                />
              </span>

              <div>

                <small>
                  Ürün Maliyeti
                </small>

                <strong>
                  {formatMoney(
                    metrics.monthPurchaseCost
                  )}
                </strong>

                <p>
                  Satılan cihazların alış maliyeti
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon green">
                <Banknote
                  size={21}
                />
              </span>

              <div>

                <small>
                  Brüt Kâr
                </small>

                <strong>
                  {formatMoney(
                    metrics.monthGrossProfit
                  )}
                </strong>

                <p>
                  Ciro - cihaz maliyeti
                </p>

              </div>

            </article>

          </div>


          <div className="reports-two-column">

            <section className="admin-card">

              <div className="admin-card-head">

                <div className="admin-card-title">

                  <PackageCheck
                    size={19}
                  />

                  <strong>
                    Marka Performansı
                  </strong>

                </div>

              </div>


              <div className="reports-brand-list">

                {(data?.brands || []).map(
                  (brand) => (

                    <article
                      key={
                        brand.brand
                      }
                      className="reports-brand-card"
                    >

                      <div className="reports-brand-head">

                        <strong>
                          {brand.brand}
                        </strong>

                        <span>
                          {brand.deviceCount}
                          {" "}cihaz
                        </span>

                      </div>


                      <div className="reports-brand-stats">

                        <div>

                          <small>
                            Satış
                          </small>

                          <strong>
                            {brand.salesCount}
                          </strong>

                        </div>


                        <div>

                          <small>
                            Ciro
                          </small>

                          <strong>
                            {formatMoney(
                              brand.revenue
                            )}
                          </strong>

                        </div>


                        <div>

                          <small>
                            Brüt Kâr
                          </small>

                          <strong>
                            {formatMoney(
                              brand.grossProfit
                            )}
                          </strong>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            </section>


            <section className="admin-card">

              <div className="admin-card-head">

                <div className="admin-card-title">

                  <Landmark
                    size={19}
                  />

                  <strong>
                    Tahsilat Dağılımı
                  </strong>

                </div>

              </div>


              <div className="reports-payment-list">

                {(data?.paymentMethods || []).map(
                  (item) => (

                    <div
                      className="reports-payment-row"
                      key={
                        item.method
                      }
                    >

                      <span>
                        {item.method}
                      </span>

                      <strong>
                        {formatMoney(
                          item.amount
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

            </section>

          </div>


          <section className="admin-card reports-sales-card">

            <div className="admin-card-head">

              <div className="admin-card-title">

                <BarChart3
                  size={19}
                />

                <strong>
                  {monthLabel} Satışları
                </strong>

              </div>


              <span className="reports-sale-count">
                {(data?.sales || []).length}
                {" "}satış kaydı
              </span>

            </div>


            {(data?.sales || []).length ===
            0 ? (

              <div className="admin-empty">
                Seçilen ayda satış kaydı yok.
              </div>

            ) : (

              <div className="admin-table-wrap">

                <table className="admin-table large reports-sales-table">

                  <thead>

                    <tr>

                      <th>
                        Tarih
                      </th>

                      <th>
                        Hasta
                      </th>

                      <th>
                        Marka
                      </th>

                      <th>
                        Cihaz
                      </th>

                      <th>
                        Adet
                      </th>

                      <th>
                        Satış
                      </th>

                      <th>
                        Maliyet
                      </th>

                      <th>
                        Brüt Kâr
                      </th>

                      <th>
                        Ödenen
                      </th>

                      <th>
                        Kalan
                      </th>

                      <th>
                        Durum
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {data.sales.map(
                      (sale) => (

                        <tr
                          key={
                            sale.id
                          }
                        >

                          <td>
                            {formatDate(
                              sale.purchase_date
                            )}
                          </td>


                          <td>

                            <button
                              type="button"
                              className="admin-name-link"
                              onClick={
                                () =>
                                  onOpenProfile?.(
                                    sale.id
                                  )
                              }
                            >
                              {sale.full_name}
                            </button>

                          </td>


                          <td>
                            {sale.brand}
                          </td>


                          <td>
                            {sale.device_name ||
                              "—"}
                          </td>


                          <td>
                            {sale.sale_quantity}
                          </td>


                          <td>
                            <strong>
                              {formatMoney(
                                sale.sale_price
                              )}
                            </strong>
                          </td>


                          <td>
                            {formatMoney(
                              sale.purchase_cost
                            )}
                          </td>


                          <td>
                            <strong
                              className={
                                sale.gross_profit <
                                0
                                  ? "reports-negative"
                                  : "reports-positive"
                              }
                            >
                              {formatMoney(
                                sale.gross_profit
                              )}
                            </strong>
                          </td>


                          <td>
                            {formatMoney(
                              sale.total_paid
                            )}
                          </td>


                          <td>
                            {formatMoney(
                              sale.remaining
                            )}
                          </td>


                          <td>

                            <span
                              className={
                                `admin-badge ${statusClass(
                                  sale.payment_status
                                )}`
                              }
                            >
                              {sale.payment_status}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </>

      )}

    </>
  );
}