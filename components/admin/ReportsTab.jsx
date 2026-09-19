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
  Edit3,
  Landmark,
  PackageCheck,
  Plus,
  ReceiptText,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";


const EXPENSE_CATEGORIES = [
  "Kira",
  "Elektrik",
  "Su",
  "İnternet / Telefon",
  "Personel",
  "Reklam",
  "POS Komisyonu",
  "Sarf Malzeme",
  "Kargo",
  "Vergi / Harç",
  "Bakım / Onarım",
  "Diğer",
];


const PAYMENT_METHODS = [
  "Nakit",
  "Kart",
  "Havale/EFT",
  "Diğer",
];


function todayTurkey() {
  return new Intl.DateTimeFormat(
    "en-CA",
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
  ).format(
    new Date()
  );
}


const EMPTY_EXPENSE = {
  id: "",
  expense_date:
    todayTurkey(),

  category:
    "Kira",

  amount: "",

  payment_method:
    "Nakit",

  description: "",
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
  return `${new Intl.NumberFormat(
    "tr-TR",
    {
      maximumFractionDigits: 0,
    }
  ).format(
    Number(
      value || 0
    )
  )} TL`;
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
    status === "Ödendi"
  ) {
    return "green";
  }


  if (
    status === "Kısmi"
  ) {
    return "orange";
  }


  return "gray";
}


function currentMonth() {
  return todayTurkey()
    .slice(
      0,
      7
    );
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


  const [
    expenseModal,
    setExpenseModal,
  ] =
    useState(false);


  const [
    expenseForm,
    setExpenseForm,
  ] =
    useState({
      ...EMPTY_EXPENSE,
    });


  const [
    savingExpense,
    setSavingExpense,
  ] =
    useState(false);


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


  function openNewExpense() {
    setExpenseForm({
      ...EMPTY_EXPENSE,

      expense_date:
        todayTurkey(),
    });

    setError("");

    setExpenseModal(
      true
    );
  }


  function openEditExpense(
    expense
  ) {
    setExpenseForm({
      id:
        expense.id,

      expense_date:
        expense.expense_date,

      category:
        expense.category,

      amount:
        expense.amount,

      payment_method:
        expense.payment_method,

      description:
        expense.description ||
        "",
    });


    setError("");

    setExpenseModal(
      true
    );
  }


  async function saveExpense(
    event
  ) {
    event.preventDefault();

    setSavingExpense(
      true
    );

    setError("");


    try {
      await requestJson(
        "/api/admin/expenses",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                expenseForm.id
                  ? "update"
                  : "create",

              data:
                expenseForm,
            }),
        }
      );


      setExpenseModal(
        false
      );


      await loadReports();

    } catch (err) {
      setError(
        err.message
      );

    } finally {
      setSavingExpense(
        false
      );
    }
  }


  async function deleteExpense(
    expense
  ) {
    const confirmed =
      window.confirm(
        `${expense.category} - ${formatMoney(
          expense.amount
        )} gider kaydını silmek istiyor musunuz?`
      );


    if (!confirmed) {
      return;
    }


    setError("");


    try {
      await requestJson(
        "/api/admin/expenses",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              action:
                "delete",

              data: {
                id:
                  expense.id,
              },
            }),
        }
      );


      await loadReports();

    } catch (err) {
      setError(
        err.message
      );
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
            Number(
              monthNumber
            ) - 1,
            1
          );


        return new Intl.DateTimeFormat(
          "tr-TR",
          {
            month:
              "long",

            year:
              "numeric",
          }
        ).format(
          date
        );
      },
      [month]
    );


  const metrics =
    data?.metrics || {
      todaySalesRevenue: 0,
      todayDeviceCount: 0,
      todayCollections: 0,
      todayExpenseTotal: 0,

      monthRevenue: 0,
      monthDeviceCount: 0,
      monthCollections: 0,

      monthPurchaseCost: 0,
      monthGrossProfit: 0,

      monthExpenseTotal: 0,
      monthNetProfit: 0,

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
            Satış, tahsilat, gider,
            alacak ve kâr durumunu takip edin.
          </p>

        </div>


        <div className="reports-head-actions">

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


          <button
            type="button"
            className="admin-primary-button"
            onClick={
              openNewExpense
            }
          >
            <Plus
              size={17}
            />

            Gider Ekle
          </button>

        </div>

      </div>


      {error && (
        <div className="admin-form-error reports-error">
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

              <span className="reports-metric-icon red">
                <TrendingDown
                  size={21}
                />
              </span>

              <div>

                <small>
                  Bugünkü Gider
                </small>

                <strong>
                  {formatMoney(
                    metrics.todayExpenseTotal
                  )}
                </strong>

                <p>
                  Bugün girilen giderler
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


          <div className="reports-metric-grid reports-profit-grid">

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
                  {" "}cihaz
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
                  Satılan cihazların maliyeti
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
                  Ciro - ürün maliyeti
                </p>

              </div>

            </article>


            <article className="reports-metric-card">

              <span className="reports-metric-icon red">
                <ReceiptText
                  size={21}
                />
              </span>

              <div>

                <small>
                  Aylık Gider
                </small>

                <strong>
                  {formatMoney(
                    metrics.monthExpenseTotal
                  )}
                </strong>

                <p>
                  Kayıtlı işletme giderleri
                </p>

              </div>

            </article>


            <article className="reports-metric-card reports-net-profit-card">

              <span className="reports-metric-icon dark">
                <Wallet
                  size={21}
                />
              </span>

              <div>

                <small>
                  Net Kâr
                </small>

                <strong
                  className={
                    metrics.monthNetProfit <
                    0
                      ? "reports-negative"
                      : ""
                  }
                >
                  {formatMoney(
                    metrics.monthNetProfit
                  )}
                </strong>

                <p>
                  Brüt kâr - kayıtlı giderler
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

                  <ReceiptText
                    size={19}
                  />

                  <strong>
                    Gider Dağılımı
                  </strong>

                </div>

              </div>


              {(data?.expenseCategories || []).length ===
              0 ? (

                <div className="admin-empty">
                  Bu ay gider kaydı yok.
                </div>

              ) : (

                <div className="reports-payment-list">

                  {data.expenseCategories.map(
                    (item) => (

                      <div
                        className="reports-payment-row"
                        key={
                          item.category
                        }
                      >

                        <span>
                          {item.category}
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

              )}

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


          <section className="admin-card reports-expenses-card">

            <div className="admin-card-head">

              <div className="admin-card-title">

                <ReceiptText
                  size={19}
                />

                <strong>
                  {monthLabel} Giderleri
                </strong>

              </div>


              <button
                type="button"
                className="admin-small-primary"
                onClick={
                  openNewExpense
                }
              >
                <Plus
                  size={16}
                />

                Gider Ekle
              </button>

            </div>


            {(data?.expenses || []).length ===
            0 ? (

              <div className="admin-empty">
                Seçilen ayda gider kaydı yok.
              </div>

            ) : (

              <div className="admin-table-wrap">

                <table className="admin-table large">

                  <thead>

                    <tr>

                      <th>
                        Tarih
                      </th>

                      <th>
                        Kategori
                      </th>

                      <th>
                        Açıklama
                      </th>

                      <th>
                        Ödeme
                      </th>

                      <th>
                        Tutar
                      </th>

                      <th>
                        İşlem
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {data.expenses.map(
                      (expense) => (

                        <tr
                          key={
                            expense.id
                          }
                        >

                          <td>
                            {formatDate(
                              expense.expense_date
                            )}
                          </td>


                          <td>

                            <strong>
                              {expense.category}
                            </strong>

                          </td>


                          <td>
                            {expense.description ||
                              "—"}
                          </td>


                          <td>
                            {expense.payment_method}
                          </td>


                          <td>

                            <strong>
                              {formatMoney(
                                expense.amount
                              )}
                            </strong>

                          </td>


                          <td>

                            <div className="admin-row-actions">

                              <button
                                type="button"
                                className="admin-icon-button"
                                onClick={
                                  () =>
                                    openEditExpense(
                                      expense
                                    )
                                }
                                title="Gideri düzenle"
                              >
                                <Edit3
                                  size={16}
                                />
                              </button>


                              <button
                                type="button"
                                className="admin-icon-button reports-delete-button"
                                onClick={
                                  () =>
                                    deleteExpense(
                                      expense
                                    )
                                }
                                title="Gideri sil"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


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


      {expenseModal && (

        <div
          className="admin-modal-backdrop"
          onMouseDown={
            () =>
              setExpenseModal(
                false
              )
          }
        >

          <section
            className="admin-modal reports-expense-modal"
            onMouseDown={
              (event) =>
                event.stopPropagation()
            }
          >

            <header className="admin-modal-head">

              <div>

                <h2>
                  {expenseForm.id
                    ? "Gideri Düzenle"
                    : "Yeni Gider Ekle"}
                </h2>

                <p>
                  İşletme giderini kasa raporuna ekleyin.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  () =>
                    setExpenseModal(
                      false
                    )
                }
              >
                <X
                  size={20}
                />
              </button>

            </header>


            <form
              className="admin-form"
              onSubmit={
                saveExpense
              }
            >

              <div className="admin-form-grid">

                <label className="admin-field">

                  <span>
                    Gider Tarihi
                  </span>

                  <input
                    type="date"
                    value={
                      expenseForm.expense_date
                    }
                    onChange={
                      (event) =>
                        setExpenseForm({
                          ...expenseForm,

                          expense_date:
                            event.target.value,
                        })
                    }
                    required
                  />

                </label>


                <label className="admin-field">

                  <span>
                    Kategori
                  </span>

                  <select
                    value={
                      expenseForm.category
                    }
                    onChange={
                      (event) =>
                        setExpenseForm({
                          ...expenseForm,

                          category:
                            event.target.value,
                        })
                    }
                  >

                    {EXPENSE_CATEGORIES.map(
                      (category) => (

                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {category}
                        </option>

                      )
                    )}

                  </select>

                </label>


                <label className="admin-field">

                  <span>
                    Tutar
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      expenseForm.amount
                    }
                    onChange={
                      (event) =>
                        setExpenseForm({
                          ...expenseForm,

                          amount:
                            event.target.value,
                        })
                    }
                    placeholder="Örn. 12500"
                    required
                  />

                </label>


                <label className="admin-field">

                  <span>
                    Ödeme Yöntemi
                  </span>

                  <select
                    value={
                      expenseForm.payment_method
                    }
                    onChange={
                      (event) =>
                        setExpenseForm({
                          ...expenseForm,

                          payment_method:
                            event.target.value,
                        })
                    }
                  >

                    {PAYMENT_METHODS.map(
                      (method) => (

                        <option
                          key={
                            method
                          }
                          value={
                            method
                          }
                        >
                          {method}
                        </option>

                      )
                    )}

                  </select>

                </label>


                <label className="admin-field full">

                  <span>
                    Açıklama
                  </span>

                  <textarea
                    rows={4}
                    value={
                      expenseForm.description
                    }
                    onChange={
                      (event) =>
                        setExpenseForm({
                          ...expenseForm,

                          description:
                            event.target.value,
                        })
                    }
                    placeholder="Örn. Eylül ayı dükkan kirası"
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
                      setExpenseModal(
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
                    savingExpense
                  }
                >
                  {savingExpense
                    ? "Kaydediliyor..."
                    : "Gideri Kaydet"}
                </button>

              </div>

            </form>

          </section>

        </div>

      )}

    </>
  );
}