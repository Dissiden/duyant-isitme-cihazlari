"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Box,
  CalendarDays,
  Edit3,
  Ear,
  Eye,
  Home,
  LogOut,
  Menu,
  PackagePlus,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

import PatientProfileModal from "@/components/admin/PatientProfileModal";
import AppointmentsTab from "@/components/admin/AppointmentsTab";
import TodayAppointmentsCard from "@/components/admin/TodayAppointmentsCard";


const EMPTY_PATIENT = {
  id: "",
  full_name: "",
  tc_identity: "",
  phone: "",
  address: "",

  inventory_id: "",
  device_name: "",

  device_side: "",
  right_serial_number: "",
  left_serial_number: "",

  power_type: "",
  battery_size: "",

  sale_price: "",

  report_status: "",
  institution_status: "",

  purchase_date: "",

  warranty_start_date: "",
  warranty_end_date: "",

  notes: "",
};


const EMPTY_REPAIR = {
  id: "",
  patient_id: "",
  tc_identity: "",
  full_name: "",
  phone: "",
  device_name: "",
  sent_date: "",
  status: "Tamire Gönderildi",
  description: "",
};


const EMPTY_INVENTORY = {
  id: "",
  product_name: "",
  brand: "Coselgi",
  category: "İşitme Cihazı",
  stock_quantity: 0,
  minimum_stock: 1,
  notes: "",
};


const BRANDS = [
  "Coselgi",
  "Unitron",
];


const CATEGORIES = [
  "İşitme Cihazı",
  "Pil",
  "Filtre",
  "Dome",
  "Şarj Cihazı",
  "Temizlik / Bakım",
  "Diğer",
];


const REPAIR_STATUSES = [
  "Tamire Gönderildi",
  "Serviste",
  "Tamir Tamamlandı",
  "Teslim Edildi",
];


const TABS = [
  {
    id: "dashboard",
    label: "Genel Bakış",
    icon: Home,
  },

  {
    id: "patients",
    label: "Hastalar",
    icon: Users,
  },

  {
    id: "appointments",
    label: "Randevular",
    icon: CalendarDays,
  },

  {
    id: "repairs",
    label: "Tamirler",
    icon: Wrench,
  },

  {
    id: "inventory",
    label: "Envanter / Stok",
    icon: Box,
  },
];


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
        "İşlem başarısız."
    );
  }


  return data;
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


function formatPrice(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }


  const number =
    Number(value);


  if (
    !Number.isFinite(number)
  ) {
    return "—";
  }


  return new Intl.NumberFormat(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }
  ).format(number);
}


function repairStatusClass(
  status
) {
  if (
    status === "Teslim Edildi"
  ) {
    return "green";
  }


  if (
    status === "Tamir Tamamlandı"
  ) {
    return "teal";
  }


  if (
    status === "Serviste"
  ) {
    return "orange";
  }


  return "blue";
}


function Modal({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={onClose}
    >
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={
          (event) =>
            event.stopPropagation()
        }
      >
        <header className="admin-modal-head">

          <div>

            <h2>
              {title}
            </h2>

            {subtitle && (
              <p>
                {subtitle}
              </p>
            )}

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>

        </header>


        {children}

      </section>
    </div>
  );
}


function Field({
  label,
  children,
  full = false,
}) {
  return (
    <label
      className={
        full
          ? "admin-field full"
          : "admin-field"
      }
    >
      <span>
        {label}
      </span>

      {children}
    </label>
  );
}


function EmptyState({
  text,
}) {
  return (
    <div className="admin-empty">
      {text}
    </div>
  );
}


function Dashboard({
  summary,
  loading,
  setTab,
  openPatient,
  openProfile,
  openRepair,
  openInventory,
}) {
  if (
    loading &&
    !summary
  ) {
    return (
      <div className="admin-loading-card">
        Dashboard yükleniyor...
      </div>
    );
  }


  const data =
    summary || {
      totals: {
        patients: 0,
        activeRepairs: 0,
        lowStock: 0,
        todayAppointments: 0,
        totalReceivable: 0,
        warrantyExpiring: 0,
      },

      recentPatients: [],
      recentRepairs: [],
      lowStock: [],
      warrantyExpiring: [],
    };


  return (
    <>

      <div className="admin-page-title-row">

        <div>

          <h1>
            Hoş geldiniz
          </h1>

          <p>
            DuyAnt yönetim panelinin güncel özeti.
          </p>

        </div>

      </div>


      <div className="admin-stat-grid">

        <article className="admin-stat blue">

          <span className="admin-stat-icon">
            <Users size={23} />
          </span>

          <div>

            <small>
              Toplam Hasta
            </small>

            <strong>
              {data.totals.patients}
            </strong>

            <p>
              Kayıtlı hasta
            </p>

          </div>

        </article>


        <article className="admin-stat green">

          <span className="admin-stat-icon">
            <Wrench size={23} />
          </span>

          <div>

            <small>
              Aktif Tamir
            </small>

            <strong>
              {data.totals.activeRepairs}
            </strong>

            <p>
              Teslim edilmemiş
            </p>

          </div>

        </article>


        <article className="admin-stat purple">

          <span className="admin-stat-icon">
            <CalendarDays size={23} />
          </span>

          <div>

            <small>
              Bugünkü Randevu
            </small>

            <strong>
              {data.totals.todayAppointments}
            </strong>

            <p>
              Planlanan kontrol / ayar
            </p>

          </div>

        </article>


        <article className="admin-stat orange">

          <span className="admin-stat-icon">
            <Wallet size={23} />
          </span>

          <div>

            <small>
              Toplam Alacak
            </small>

            <strong className="admin-stat-money">
              {formatPrice(
                data.totals.totalReceivable
              )}
            </strong>

            <p>
              Hastalardan kalan tutar
            </p>

          </div>

        </article>

      </div>


      <div className="admin-dashboard-alert-grid">

        <article className="admin-dashboard-alert">

          <span className="admin-dashboard-alert-icon orange">
            <Box size={20} />
          </span>

          <div>

            <small>
              Düşük Stok
            </small>

            <strong>
              {data.totals.lowStock}
            </strong>

          </div>


          <button
            type="button"
            onClick={
              () =>
                setTab(
                  "inventory"
                )
            }
          >
            Görüntüle
          </button>

        </article>


        <article className="admin-dashboard-alert">

          <span className="admin-dashboard-alert-icon blue">
            <ShieldCheck size={20} />
          </span>

          <div>

            <small>
              30 Gün İçinde Garanti Bitişi
            </small>

            <strong>
              {data.totals.warrantyExpiring}
            </strong>

          </div>

        </article>

      </div>


      <div className="admin-dashboard-grid">

        <TodayAppointmentsCard
          onOpenProfile={
            openProfile
          }
          onOpenAppointments={
            () =>
              setTab(
                "appointments"
              )
          }
          refreshKey={
            data.totals.todayAppointments
          }
        />


        <section className="admin-card">

          <div className="admin-card-head">

            <div className="admin-card-title">

              <Users size={19} />

              <strong>
                Son Eklenen Hastalar
              </strong>

            </div>


            <button
              type="button"
              className="admin-small-primary"
              onClick={openPatient}
            >
              <Plus size={16} />

              Yeni Hasta
            </button>

          </div>


          {data.recentPatients.length ? (

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Hasta
                    </th>

                    <th>
                      Cihaz
                    </th>

                    <th>
                      Fiyat
                    </th>

                    <th>
                      Tarih
                    </th>

                    <th />

                  </tr>

                </thead>


                <tbody>

                  {data.recentPatients.map(
                    (row) => (

                      <tr key={row.id}>

                        <td>

                          <button
                            type="button"
                            className="admin-name-link"
                            onClick={
                              () =>
                                openProfile(
                                  row.id
                                )
                            }
                          >
                            {row.full_name}
                          </button>

                        </td>

                        <td>
                          {row.device_name || "—"}
                        </td>

                        <td>
                          {formatPrice(
                            row.sale_price
                          )}
                        </td>

                        <td>
                          {formatDate(
                            row.purchase_date
                          )}
                        </td>

                        <td>

                          <button
                            type="button"
                            className="admin-icon-button"
                            onClick={
                              () =>
                                openProfile(
                                  row.id
                                )
                            }
                            title="Hasta profilini aç"
                          >
                            <Eye size={16} />
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyState
              text="Henüz hasta kaydı yok."
            />

          )}


          <button
            type="button"
            className="admin-card-link"
            onClick={
              () =>
                setTab(
                  "patients"
                )
            }
          >
            Tüm hastaları görüntüle →
          </button>

        </section>


        <section className="admin-card">

          <div className="admin-card-head">

            <div className="admin-card-title">

              <Wrench size={19} />

              <strong>
                Son Tamir Kayıtları
              </strong>

            </div>


            <button
              type="button"
              className="admin-small-primary"
              onClick={openRepair}
            >
              <Plus size={16} />

              Yeni Tamir
            </button>

          </div>


          {data.recentRepairs.length ? (

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Hasta
                    </th>

                    <th>
                      Cihaz
                    </th>

                    <th>
                      Gönderim
                    </th>

                    <th>
                      Durum
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {data.recentRepairs.map(
                    (row) => (

                      <tr key={row.id}>

                        <td>
                          {row.full_name}
                        </td>

                        <td>
                          {row.device_name || "—"}
                        </td>

                        <td>
                          {formatDate(
                            row.sent_date
                          )}
                        </td>

                        <td>

                          <span
                            className={
                              `admin-badge ${repairStatusClass(
                                row.status
                              )}`
                            }
                          >
                            {row.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyState
              text="Henüz tamir kaydı yok."
            />

          )}


          <button
            type="button"
            className="admin-card-link"
            onClick={
              () =>
                setTab(
                  "repairs"
                )
            }
          >
            Tüm tamirleri görüntüle →
          </button>

        </section>


        <section className="admin-card">

          <div className="admin-card-head">

            <div className="admin-card-title">

              <AlertTriangle size={19} />

              <strong>
                Düşük Stok
              </strong>

            </div>


            <button
              type="button"
              className="admin-outline-button"
              onClick={
                () =>
                  setTab(
                    "inventory"
                  )
              }
            >
              Stok Yönetimi
            </button>

          </div>


          {data.lowStock.length ? (

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Marka
                    </th>

                    <th>
                      Ürün
                    </th>

                    <th>
                      Stok
                    </th>

                    <th>
                      Minimum
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {data.lowStock.map(
                    (row) => (

                      <tr key={row.id}>

                        <td>
                          {row.brand || "—"}
                        </td>

                        <td>
                          {row.product_name}
                        </td>

                        <td className="admin-danger-text">
                          {row.stock_quantity}
                        </td>

                        <td>
                          {row.minimum_stock}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyState
              text="Düşük stokta ürün yok."
            />

          )}

        </section>


        <section className="admin-card">

          <div className="admin-card-head">

            <div className="admin-card-title">

              <ShieldCheck size={19} />

              <strong>
                Garanti Bitişleri
              </strong>

            </div>

          </div>


          {data.warrantyExpiring.length ? (

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Hasta
                    </th>

                    <th>
                      Cihaz
                    </th>

                    <th>
                      Garanti Bitiş
                    </th>

                    <th />

                  </tr>

                </thead>


                <tbody>

                  {data.warrantyExpiring.map(
                    (row) => (

                      <tr key={row.id}>

                        <td>

                          <button
                            type="button"
                            className="admin-name-link"
                            onClick={
                              () =>
                                openProfile(
                                  row.id
                                )
                            }
                          >
                            {row.full_name}
                          </button>

                        </td>

                        <td>
                          {row.device_name || "—"}
                        </td>

                        <td>
                          {formatDate(
                            row.warranty_end_date
                          )}
                        </td>

                        <td>

                          <button
                            type="button"
                            className="admin-icon-button"
                            onClick={
                              () =>
                                openProfile(
                                  row.id
                                )
                            }
                          >
                            <Eye size={16} />
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyState
              text="30 gün içinde garantisi bitecek cihaz yok."
            />

          )}

        </section>


        <section className="admin-card admin-dashboard-wide-card">

          <div className="admin-card-head">

            <div className="admin-card-title">

              <PackagePlus size={19} />

              <strong>
                Hızlı İşlemler
              </strong>

            </div>

          </div>


          <div className="admin-quick-actions">

            <button
              type="button"
              onClick={openPatient}
            >

              <Users size={24} />

              <span>

                <strong>
                  Yeni Hasta
                </strong>

                <small>
                  Satış ve cihaz kaydı
                </small>

              </span>

            </button>


            <button
              type="button"
              onClick={
                () =>
                  setTab(
                    "appointments"
                  )
              }
            >

              <CalendarDays size={24} />

              <span>

                <strong>
                  Randevular
                </strong>

                <small>
                  Kontrol ve ayar takibi
                </small>

              </span>

            </button>


            <button
              type="button"
              onClick={openRepair}
            >

              <Wrench size={24} />

              <span>

                <strong>
                  Yeni Tamir
                </strong>

                <small>
                  Servis kaydı oluştur
                </small>

              </span>

            </button>


            <button
              type="button"
              onClick={openInventory}
            >

              <Box size={24} />

              <span>

                <strong>
                  Envantere Ürün Ekle
                </strong>

                <small>
                  Coselgi / Unitron stok
                </small>

              </span>

            </button>

          </div>

        </section>

      </div>

    </>
  );
}


export default function AdminPanel() {
  const [
    tab,
    setTab,
  ] =
    useState(
      "dashboard"
    );


  const [
    sidebarOpen,
    setSidebarOpen,
  ] =
    useState(false);


  const [
    summary,
    setSummary,
  ] =
    useState(null);


  const [
    summaryLoading,
    setSummaryLoading,
  ] =
    useState(true);


  const [
    rows,
    setRows,
  ] =
    useState([]);


  const [
    listLoading,
    setListLoading,
  ] =
    useState(false);


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    globalSearch,
    setGlobalSearch,
  ] =
    useState("");


  const [
    modal,
    setModal,
  ] =
    useState(null);


  const [
    profilePatientId,
    setProfilePatientId,
  ] =
    useState(null);


  const [
    patientForm,
    setPatientForm,
  ] =
    useState({
      ...EMPTY_PATIENT,
    });


  const [
    repairForm,
    setRepairForm,
  ] =
    useState({
      ...EMPTY_REPAIR,
    });


  const [
    inventoryForm,
    setInventoryForm,
  ] =
    useState({
      ...EMPTY_INVENTORY,
    });


  const [
    deviceOptions,
    setDeviceOptions,
  ] =
    useState([]);


  const [
    deviceOptionsLoading,
    setDeviceOptionsLoading,
  ] =
    useState(false);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    formError,
    setFormError,
  ] =
    useState("");


  const [
    notice,
    setNotice,
  ] =
    useState("");


  const [
    patientLookupLoading,
    setPatientLookupLoading,
  ] =
    useState(false);


  const todayText =
    useMemo(
      () =>
        new Intl.DateTimeFormat(
          "tr-TR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
            weekday: "long",
          }
        ).format(
          new Date()
        ),
      []
    );


  useEffect(
    () => {
      loadSummary();
      loadDeviceOptions();
    },
    []
  );


  useEffect(
    () => {
      if (
        tab !== "dashboard" &&
        tab !== "appointments"
      ) {
        setSearch("");

        loadRows(
          tab,
          ""
        );
      }
    },
    [tab]
  );


  async function loadSummary() {
    setSummaryLoading(
      true
    );


    try {
      const data =
        await requestJson(
          "/api/admin/data?resource=summary"
        );


      setSummary(data);

    } catch (error) {
      setNotice(
        error.message
      );

    } finally {
      setSummaryLoading(
        false
      );
    }
  }


  async function loadDeviceOptions() {
    setDeviceOptionsLoading(
      true
    );


    try {
      const data =
        await requestJson(
          "/api/admin/data?resource=device-options"
        );


      setDeviceOptions(
        data.rows || []
      );

    } catch (error) {
      setNotice(
        error.message
      );

    } finally {
      setDeviceOptionsLoading(
        false
      );
    }
  }


  async function loadRows(
    resource,
    q = ""
  ) {
    setListLoading(
      true
    );


    try {
      const data =
        await requestJson(
          `/api/admin/data?resource=${resource}&q=${encodeURIComponent(
            q
          )}`
        );


      setRows(
        data.rows || []
      );

    } catch (error) {
      setNotice(
        error.message
      );

    } finally {
      setListLoading(
        false
      );
    }
  }


  function openProfile(
    patientId
  ) {
    setProfilePatientId(
      patientId
    );
  }


  function closeProfile() {
    setProfilePatientId(
      null
    );
  }


  function openPatient(
    row = null
  ) {
    setFormError("");


    if (row) {
      setPatientForm({
        id:
          row.id || "",

        full_name:
          row.full_name || "",

        tc_identity:
          row.tc_identity || "",

        phone:
          row.phone || "",

        address:
          row.address || "",

        inventory_id:
          row.inventory_id || "",

        device_name:
          row.device_name || "",

        device_side:
          row.device_side || "",

        right_serial_number:
          row.right_serial_number || "",

        left_serial_number:
          row.left_serial_number || "",

        power_type:
          row.power_type || "",

        battery_size:
          row.battery_size || "",

        sale_price:
          row.sale_price ?? "",

        report_status:
          row.report_status || "",

        institution_status:
          row.institution_status || "",

        purchase_date:
          row.purchase_date || "",

        warranty_start_date:
          row.warranty_start_date || "",

        warranty_end_date:
          row.warranty_end_date || "",

        notes:
          row.notes || "",
      });

    } else {
      setPatientForm({
        ...EMPTY_PATIENT,
      });
    }


    loadDeviceOptions();

    setModal(
      "patient"
    );
  }


  function editPatientFromProfile(
    patient
  ) {
    closeProfile();

    openPatient(
      patient
    );
  }


  function openRepair(
    row = null
  ) {
    setFormError("");


    if (row) {
      setRepairForm({
        id:
          row.id || "",

        patient_id:
          row.patient_id || "",

        tc_identity:
          row.tc_identity || "",

        full_name:
          row.full_name || "",

        phone:
          row.phone || "",

        device_name:
          row.device_name || "",

        sent_date:
          row.sent_date || "",

        status:
          row.status ||
          "Tamire Gönderildi",

        description:
          row.description || "",
      });

    } else {
      setRepairForm({
        ...EMPTY_REPAIR,
      });
    }


    setModal(
      "repair"
    );
  }


  function openInventory(
    row = null
  ) {
    setFormError("");


    if (row) {
      setInventoryForm({
        id:
          row.id || "",

        product_name:
          row.product_name || "",

        brand:
          row.brand ||
          "Coselgi",

        category:
          row.category ||
          "İşitme Cihazı",

        stock_quantity:
          row.stock_quantity ?? 0,

        minimum_stock:
          row.minimum_stock ?? 1,

        notes:
          row.notes || "",
      });

    } else {
      setInventoryForm({
        ...EMPTY_INVENTORY,
      });
    }


    setModal(
      "inventory"
    );
  }


  async function saveResource(
    resource,
    form
  ) {
    setSaving(true);
    setFormError("");


    try {
      const isUpdate =
        Boolean(
          form.id
        );


      await requestJson(
        "/api/admin/data",
        {
          method: "POST",

          body:
            JSON.stringify({
              resource,

              action:
                isUpdate
                  ? "update"
                  : "create",

              data:
                form,
            }),
        }
      );


      setModal(null);


      if (
        resource === "patients"
      ) {
        setNotice(
          isUpdate
            ? "Hasta bilgileri ve cihaz kaydı güncellendi."
            : "Hasta kaydedildi ve cihaz stoktan otomatik düşürüldü."
        );

      } else if (
        resource === "inventory"
      ) {
        setNotice(
          "Envanter kaydı güncellendi."
        );

      } else {
        setNotice(
          "Kayıt başarıyla kaydedildi."
        );
      }


      await Promise.all([
        loadSummary(),
        loadDeviceOptions(),
      ]);


      if (
        tab === resource
      ) {
        await loadRows(
          resource,
          search
        );
      }

    } catch (error) {
      setFormError(
        error.message
      );

    } finally {
      setSaving(false);
    }
  }


  async function lookupPatientForRepair() {
    const tc =
      String(
        repairForm.tc_identity ||
          ""
      )
        .replace(
          /\D/g,
          ""
        );


    if (
      tc.length !== 11
    ) {
      setFormError(
        "11 haneli TC Kimlik No yazın."
      );

      return;
    }


    setPatientLookupLoading(
      true
    );

    setFormError("");


    try {
      const data =
        await requestJson(
          `/api/admin/data?resource=patients&q=${encodeURIComponent(
            tc
          )}`
        );


      const patient =
        (
          data.rows || []
        ).find(
          (row) =>
            row.tc_identity === tc
        );


      if (!patient) {
        setFormError(
          "Bu TC Kimlik No ile kayıtlı hasta bulunamadı."
        );

        return;
      }


      setRepairForm(
        (current) => ({
          ...current,

          patient_id:
            patient.id,

          tc_identity:
            patient.tc_identity,

          full_name:
            patient.full_name,

          phone:
            patient.phone || "",

          device_name:
            patient.device_name || "",
        })
      );

    } catch (error) {
      setFormError(
        error.message
      );

    } finally {
      setPatientLookupLoading(
        false
      );
    }
  }


  async function logout() {
    await fetch(
      "/api/admin/logout",
      {
        method: "POST",
      }
    );


    window.location.href =
      "/admin/login";
  }


  function submitSearch(
    event
  ) {
    event.preventDefault();


    loadRows(
      tab,
      search
    );
  }


  function submitGlobalSearch(
    event
  ) {
    event.preventDefault();


    const q =
      globalSearch.trim();


    setTab(
      "patients"
    );


    setSearch(q);


    setTimeout(
      () =>
        loadRows(
          "patients",
          q
        ),
      0
    );
  }


  async function refreshEverything() {
    await Promise.all([
      loadSummary(),
      loadDeviceOptions(),
    ]);


    if (
      tab !== "dashboard" &&
      tab !== "appointments"
    ) {
      await loadRows(
        tab,
        search
      );
    }
  }


  const pageTitle =
    tab === "patients"
      ? "Hasta Kayıtları"

      : tab === "appointments"
        ? "Randevular"

        : tab === "repairs"
          ? "Tamir Kayıtları"

          : tab === "inventory"
            ? "Envanter / Stok"

            : "Genel Bakış";


  return (
    <div className="admin-app">

      <aside
        className={
          sidebarOpen
            ? "admin-sidebar open"
            : "admin-sidebar"
        }
      >

        <div className="admin-brand">

          <span className="admin-brand-mark">
            <Ear size={27} />
          </span>

          <span>

            <strong>
              DuyAnt
            </strong>

            <small>
              İşitme Cihazları
            </small>

          </span>

        </div>


        <nav className="admin-nav">

          {TABS.map(
            (item) => {
              const Icon =
                item.icon;


              return (
                <button
                  type="button"
                  key={item.id}
                  className={
                    tab === item.id
                      ? "active"
                      : ""
                  }
                  onClick={
                    () => {
                      setTab(
                        item.id
                      );

                      setSidebarOpen(
                        false
                      );
                    }
                  }
                >

                  <Icon size={19} />

                  <span>
                    {item.label}
                  </span>

                </button>
              );
            }
          )}

        </nav>


        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-card">

            <Ear size={25} />

            <div>

              <strong>
                DuyAnt
              </strong>

              <span>
                Yönetim Paneli
              </span>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout"
            onClick={logout}
          >

            <LogOut size={17} />

            Çıkış Yap

          </button>

        </div>

      </aside>


      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          onClick={
            () =>
              setSidebarOpen(
                false
              )
          }
          aria-label="Menüyü kapat"
        />
      )}


      <div className="admin-main">

        <header className="admin-topbar">

          <button
            className="admin-menu-toggle"
            type="button"
            onClick={
              () =>
                setSidebarOpen(
                  (current) =>
                    !current
                )
            }
          >

            {sidebarOpen
              ? (
                  <X size={21} />
                )
              : (
                  <Menu size={21} />
                )}

          </button>


          <form
            className="admin-global-search"
            onSubmit={
              submitGlobalSearch
            }
          >

            <Search size={18} />

            <input
              value={
                globalSearch
              }
              onChange={
                (event) =>
                  setGlobalSearch(
                    event.target.value
                  )
              }
              placeholder="Hasta ara... TC, ad soyad, telefon, seri no"
            />

          </form>


          <div className="admin-profile">

            <span className="admin-profile-avatar">
              DA
            </span>

            <span className="admin-profile-text">

              <strong>
                DuyAnt Admin
              </strong>

              <small>
                {todayText}
              </small>

            </span>

          </div>

        </header>


        <main className="admin-content">

          {notice && (

            <div
              className="admin-notice"
              onClick={
                () =>
                  setNotice("")
              }
            >

              {notice}

              <span>
                ×
              </span>

            </div>

          )}


          {tab === "dashboard" ? (

            <Dashboard
              summary={summary}
              loading={
                summaryLoading
              }
              setTab={setTab}
              openPatient={
                () =>
                  openPatient()
              }
              openProfile={
                openProfile
              }
              openRepair={
                () =>
                  openRepair()
              }
              openInventory={
                () =>
                  openInventory()
              }
            />

          ) : tab === "appointments" ? (

            <AppointmentsTab
              onOpenProfile={
                openProfile
              }
              onChanged={
                refreshEverything
              }
            />

          ) : (

            <>

              <div className="admin-page-head">

                <div>

                  <span>
                    DuyAnt Yönetim
                  </span>

                  <h1>
                    {pageTitle}
                  </h1>

                  <p>

                    {tab === "patients" &&
                      "Hasta, cihaz, seri no, garanti ve satış bilgilerini yönetin."}

                    {tab === "repairs" &&
                      "Tamir kayıtlarını ve servis durumunu takip edin."}

                    {tab === "inventory" &&
                      "Coselgi, Unitron ve sarf malzemesi stoklarını yönetin."}

                  </p>

                </div>


                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={
                    () => {
                      if (
                        tab === "patients"
                      ) {
                        openPatient();

                      } else if (
                        tab === "repairs"
                      ) {
                        openRepair();

                      } else {
                        openInventory();
                      }
                    }
                  }
                >

                  <Plus size={17} />

                  {tab === "patients"
                    ? "Yeni Hasta"

                    : tab === "repairs"
                      ? "Yeni Tamir"

                      : "Yeni Ürün"}

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
                    placeholder={
                      tab === "inventory"
                        ? "Ürün, marka veya kategori ara..."
                        : "TC, ad soyad, telefon veya seri no ara..."
                    }
                  />

                  <button
                    type="submit"
                  >
                    Ara
                  </button>

                </form>


                {listLoading ? (

                  <div className="admin-loading-card">
                    Kayıtlar yükleniyor...
                  </div>

                ) : rows.length === 0 ? (

                  <EmptyState
                    text="Kayıt bulunamadı."
                  />

                ) : tab === "patients" ? (

                  <div className="admin-table-wrap">

                    <table className="admin-table large">

                      <thead>

                        <tr>

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
                            Taraf
                          </th>

                          <th>
                            Seri No
                          </th>

                          <th>
                            Fiyat
                          </th>

                          <th>
                            Rapor
                          </th>

                          <th>
                            Kurum
                          </th>

                          <th>
                            Garanti Bitiş
                          </th>

                          <th>
                            İşlem
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {rows.map(
                          (row) => {

                            let serialText =
                              "—";


                            if (
                              row.device_side === "Sağ"
                            ) {
                              serialText =
                                row.right_serial_number ||
                                "—";

                            } else if (
                              row.device_side === "Sol"
                            ) {
                              serialText =
                                row.left_serial_number ||
                                "—";

                            } else if (
                              row.device_side === "Çift"
                            ) {
                              serialText =
                                `S: ${
                                  row.right_serial_number ||
                                  "—"
                                } / L: ${
                                  row.left_serial_number ||
                                  "—"
                                }`;
                            }


                            return (

                              <tr key={row.id}>

                                <td>

                                  <button
                                    type="button"
                                    className="admin-name-link"
                                    onClick={
                                      () =>
                                        openProfile(
                                          row.id
                                        )
                                    }
                                  >
                                    {row.full_name}
                                  </button>

                                </td>

                                <td>
                                  {row.tc_identity}
                                </td>

                                <td>
                                  {row.phone || "—"}
                                </td>

                                <td>
                                  {row.device_name || "—"}
                                </td>

                                <td>
                                  {row.device_side || "—"}
                                </td>

                                <td className="admin-serial-cell">
                                  {serialText}
                                </td>

                                <td>

                                  <strong>
                                    {formatPrice(
                                      row.sale_price
                                    )}
                                  </strong>

                                </td>

                                <td>

                                  <span
                                    className={
                                      `admin-badge ${
                                        row.report_status ===
                                        "Raporlu"
                                          ? "green"
                                          : "gray"
                                      }`
                                    }
                                  >
                                    {row.report_status || "—"}
                                  </span>

                                </td>

                                <td>

                                  <span
                                    className={
                                      `admin-badge ${
                                        row.institution_status ===
                                        "Kurumlu"
                                          ? "blue"
                                          : "gray"
                                      }`
                                    }
                                  >
                                    {row.institution_status || "—"}
                                  </span>

                                </td>

                                <td>
                                  {formatDate(
                                    row.warranty_end_date
                                  )}
                                </td>

                                <td>

                                  <div className="admin-row-actions">

                                    <button
                                      type="button"
                                      className="admin-icon-button"
                                      onClick={
                                        () =>
                                          openProfile(
                                            row.id
                                          )
                                      }
                                      title="Hasta profili"
                                    >
                                      <Eye size={16} />
                                    </button>


                                    <button
                                      type="button"
                                      className="admin-icon-button"
                                      onClick={
                                        () =>
                                          openPatient(
                                            row
                                          )
                                      }
                                      title="Düzenle"
                                    >
                                      <Edit3 size={16} />
                                    </button>

                                  </div>

                                </td>

                              </tr>

                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : tab === "repairs" ? (

                  <div className="admin-table-wrap">

                    <table className="admin-table large">

                      <thead>

                        <tr>

                          <th>
                            Hasta
                          </th>

                          <th>
                            TC
                          </th>

                          <th>
                            Cihaz
                          </th>

                          <th>
                            Gönderim
                          </th>

                          <th>
                            Durum
                          </th>

                          <th>
                            Açıklama
                          </th>

                          <th />

                        </tr>

                      </thead>


                      <tbody>

                        {rows.map(
                          (row) => (

                            <tr key={row.id}>

                              <td>

                                <strong>
                                  {row.full_name}
                                </strong>

                              </td>

                              <td>
                                {row.tc_identity}
                              </td>

                              <td>
                                {row.device_name || "—"}
                              </td>

                              <td>
                                {formatDate(
                                  row.sent_date
                                )}
                              </td>

                              <td>

                                <span
                                  className={
                                    `admin-badge ${repairStatusClass(
                                      row.status
                                    )}`
                                  }
                                >
                                  {row.status}
                                </span>

                              </td>

                              <td className="admin-description-cell">
                                {row.description || "—"}
                              </td>

                              <td>

                                <button
                                  type="button"
                                  className="admin-icon-button"
                                  onClick={
                                    () =>
                                      openRepair(
                                        row
                                      )
                                  }
                                >
                                  <Edit3 size={16} />
                                </button>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="admin-table-wrap">

                    <table className="admin-table large">

                      <thead>

                        <tr>

                          <th>
                            Marka
                          </th>

                          <th>
                            Model / Ürün
                          </th>

                          <th>
                            Kategori
                          </th>

                          <th>
                            Stok
                          </th>

                          <th>
                            Minimum
                          </th>

                          <th>
                            Durum
                          </th>

                          <th />

                        </tr>

                      </thead>


                      <tbody>

                        {rows.map(
                          (row) => {

                            const lowStock =
                              Number(
                                row.stock_quantity
                              ) <=
                              Number(
                                row.minimum_stock
                              );


                            return (

                              <tr key={row.id}>

                                <td>

                                  <strong>
                                    {row.brand || "—"}
                                  </strong>

                                </td>

                                <td>
                                  {row.product_name}
                                </td>

                                <td>
                                  {row.category || "—"}
                                </td>

                                <td
                                  className={
                                    lowStock
                                      ? "admin-danger-text"
                                      : ""
                                  }
                                >
                                  {row.stock_quantity}
                                </td>

                                <td>
                                  {row.minimum_stock}
                                </td>

                                <td>

                                  <span
                                    className={
                                      `admin-badge ${
                                        lowStock
                                          ? "orange"
                                          : "green"
                                      }`
                                    }
                                  >
                                    {row.stock_quantity === 0
                                      ? "Stok Yok"
                                      : lowStock
                                        ? "Düşük Stok"
                                        : "Yeterli"}
                                  </span>

                                </td>

                                <td>

                                  <button
                                    type="button"
                                    className="admin-icon-button"
                                    onClick={
                                      () =>
                                        openInventory(
                                          row
                                        )
                                    }
                                  >
                                    <Edit3 size={16} />
                                  </button>

                                </td>

                              </tr>

                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            </>

          )}

        </main>

      </div>


      {profilePatientId && (

        <PatientProfileModal
          patientId={
            profilePatientId
          }
          onClose={
            closeProfile
          }
          onChanged={
            refreshEverything
          }
          onEditPatient={
            editPatientFromProfile
          }
        />

      )}


      {modal === "patient" && (

        <Modal
          title={
            patientForm.id
              ? "Hasta Kaydını Düzenle"
              : "Yeni Hasta Ekle"
          }
          subtitle="Hasta, satış, cihaz, seri no ve garanti bilgilerini girin."
          onClose={
            () =>
              setModal(null)
          }
        >

          <form
            className="admin-form"
            onSubmit={
              (event) => {
                event.preventDefault();

                saveResource(
                  "patients",
                  patientForm
                );
              }
            }
          >

            <div className="admin-form-section">

              <h3>
                Hasta Bilgileri
              </h3>


              <div className="admin-form-grid">

                <Field label="Ad Soyad">

                  <input
                    value={
                      patientForm.full_name
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          full_name:
                            event.target.value,
                        })
                    }
                    required
                  />

                </Field>


                <Field label="TC Kimlik No">

                  <input
                    value={
                      patientForm.tc_identity
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          tc_identity:
                            event.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                11
                              ),
                        })
                    }
                    inputMode="numeric"
                    maxLength={11}
                    required
                  />

                </Field>


                <Field label="Telefon">

                  <input
                    value={
                      patientForm.phone
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          phone:
                            event.target.value,
                        })
                    }
                    placeholder="05xx xxx xx xx"
                  />

                </Field>


                <Field label="Cihazı Aldığı Tarih">

                  <input
                    type="date"
                    value={
                      patientForm.purchase_date
                    }
                    onChange={
                      (event) => {

                        const value =
                          event.target.value;


                        setPatientForm({
                          ...patientForm,

                          purchase_date:
                            value,

                          warranty_start_date:
                            patientForm.warranty_start_date ||
                            value,
                        });
                      }
                    }
                  />

                </Field>

              </div>

            </div>


            <div className="admin-form-section">

              <h3>
                Cihaz Bilgileri
              </h3>


              <div className="admin-form-grid">

                <Field label="Envanterden Cihaz">

                  <select
                    value={
                      patientForm.inventory_id
                    }
                    onChange={
                      (event) => {

                        const inventoryId =
                          event.target.value;


                        const selected =
                          deviceOptions.find(
                            (item) =>
                              item.id ===
                              inventoryId
                          );


                        setPatientForm({
                          ...patientForm,

                          inventory_id:
                            inventoryId,

                          device_name:
                            selected
                              ? `${selected.brand} - ${selected.product_name}`
                              : "",
                        });
                      }
                    }
                    disabled={
                      deviceOptionsLoading
                    }
                    required
                  >

                    <option value="">
                      {deviceOptionsLoading
                        ? "Cihazlar yükleniyor..."
                        : "Cihaz seçin"}
                    </option>


                    {deviceOptions.map(
                      (device) => {

                        const stock =
                          Number(
                            device.stock_quantity ||
                            0
                          );


                        const currentSelection =
                          patientForm.inventory_id ===
                          device.id;


                        const disabled =
                          stock <= 0 &&
                          !currentSelection;


                        return (

                          <option
                            key={device.id}
                            value={device.id}
                            disabled={disabled}
                          >
                            {device.brand}
                            {" - "}
                            {device.product_name}
                            {" • Stok: "}
                            {stock}

                            {stock <= 0
                              ? " • STOK YOK"
                              : ""}
                          </option>

                        );
                      }
                    )}

                  </select>

                </Field>


                <Field label="Sağ / Sol / Çift">

                  <select
                    value={
                      patientForm.device_side
                    }
                    onChange={
                      (event) => {

                        const value =
                          event.target.value;


                        setPatientForm({
                          ...patientForm,

                          device_side:
                            value,

                          right_serial_number:
                            value === "Sol"
                              ? ""
                              : patientForm.right_serial_number,

                          left_serial_number:
                            value === "Sağ"
                              ? ""
                              : patientForm.left_serial_number,
                        });
                      }
                    }
                  >

                    <option value="">
                      Seçiniz
                    </option>

                    <option value="Sağ">
                      Sağ
                    </option>

                    <option value="Sol">
                      Sol
                    </option>

                    <option value="Çift">
                      Çift
                    </option>

                  </select>

                </Field>


                {(patientForm.device_side === "Sağ" ||
                  patientForm.device_side === "Çift") && (

                  <Field label="Sağ Cihaz Seri No">

                    <input
                      value={
                        patientForm.right_serial_number
                      }
                      onChange={
                        (event) =>
                          setPatientForm({
                            ...patientForm,

                            right_serial_number:
                              event.target.value,
                          })
                      }
                      placeholder="Sağ seri numarası"
                    />

                  </Field>

                )}


                {(patientForm.device_side === "Sol" ||
                  patientForm.device_side === "Çift") && (

                  <Field label="Sol Cihaz Seri No">

                    <input
                      value={
                        patientForm.left_serial_number
                      }
                      onChange={
                        (event) =>
                          setPatientForm({
                            ...patientForm,

                            left_serial_number:
                              event.target.value,
                          })
                      }
                      placeholder="Sol seri numarası"
                    />

                  </Field>

                )}


                <Field label="Pilli / Şarjlı">

                  <select
                    value={
                      patientForm.power_type
                    }
                    onChange={
                      (event) => {

                        const value =
                          event.target.value;


                        setPatientForm({
                          ...patientForm,

                          power_type:
                            value,

                          battery_size:
                            value === "Şarjlı"
                              ? ""
                              : patientForm.battery_size,
                        });
                      }
                    }
                  >

                    <option value="">
                      Seçiniz
                    </option>

                    <option value="Pilli">
                      Pilli
                    </option>

                    <option value="Şarjlı">
                      Şarjlı
                    </option>

                  </select>

                </Field>


                {patientForm.power_type === "Pilli" && (

                  <Field label="Pil Numarası">

                    <select
                      value={
                        patientForm.battery_size
                      }
                      onChange={
                        (event) =>
                          setPatientForm({
                            ...patientForm,

                            battery_size:
                              event.target.value,
                          })
                      }
                    >

                      <option value="">
                        Seçiniz
                      </option>

                      <option value="10">
                        10
                      </option>

                      <option value="13">
                        13
                      </option>

                      <option value="312">
                        312
                      </option>

                      <option value="675">
                        675
                      </option>

                    </select>

                  </Field>

                )}

              </div>

            </div>


            <div className="admin-form-section">

              <h3>
                Satış Bilgileri
              </h3>


              <div className="admin-form-grid">

                <Field label="Satış Fiyatı">

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      patientForm.sale_price
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          sale_price:
                            event.target.value,
                        })
                    }
                    placeholder="30000"
                    required
                  />

                </Field>


                <Field label="Rapor Durumu">

                  <select
                    value={
                      patientForm.report_status
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          report_status:
                            event.target.value,
                        })
                    }
                    required
                  >

                    <option value="">
                      Seçiniz
                    </option>

                    <option value="Raporlu">
                      Raporlu
                    </option>

                    <option value="Raporsuz">
                      Raporsuz
                    </option>

                  </select>

                </Field>


                <Field label="Kurum Durumu">

                  <select
                    value={
                      patientForm.institution_status
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          institution_status:
                            event.target.value,
                        })
                    }
                    required
                  >

                    <option value="">
                      Seçiniz
                    </option>

                    <option value="Kurumlu">
                      Kurumlu
                    </option>

                    <option value="Kurumsuz">
                      Kurumsuz
                    </option>

                  </select>

                </Field>

              </div>

            </div>


            <div className="admin-form-section">

              <h3>
                Garanti
              </h3>


              <div className="admin-form-grid">

                <Field label="Garanti Başlangıç">

                  <input
                    type="date"
                    value={
                      patientForm.warranty_start_date
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          warranty_start_date:
                            event.target.value,
                        })
                    }
                  />

                </Field>


                <Field label="Garanti Bitiş">

                  <input
                    type="date"
                    value={
                      patientForm.warranty_end_date
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          warranty_end_date:
                            event.target.value,
                        })
                    }
                  />

                </Field>

              </div>

            </div>


            <div className="admin-form-section">

              <h3>
                Adres & Not
              </h3>


              <div className="admin-form-grid">

                <Field
                  label="Adres"
                  full
                >

                  <textarea
                    value={
                      patientForm.address
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          address:
                            event.target.value,
                        })
                    }
                    rows={3}
                  />

                </Field>


                <Field
                  label="Açıklama / Not"
                  full
                >

                  <textarea
                    value={
                      patientForm.notes
                    }
                    onChange={
                      (event) =>
                        setPatientForm({
                          ...patientForm,

                          notes:
                            event.target.value,
                        })
                    }
                    rows={4}
                  />

                </Field>

              </div>

            </div>


            {deviceOptions.length === 0 &&
              !deviceOptionsLoading && (

                <div className="admin-form-error">
                  Envanterde henüz İşitme Cihazı kategorisinde ürün bulunmuyor.
                </div>

              )}


            {formError && (

              <div className="admin-form-error">
                {formError}
              </div>

            )}


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={
                  () =>
                    setModal(
                      null
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
                  deviceOptions.length === 0
                }
              >

                {saving
                  ? "Kaydediliyor..."
                  : patientForm.id
                    ? "Değişiklikleri Kaydet"
                    : "Hasta Kaydet"}

              </button>

            </div>

          </form>

        </Modal>

      )}


      {modal === "repair" && (

        <Modal
          title={
            repairForm.id
              ? "Tamir Kaydını Düzenle"
              : "Yeni Tamir Kaydı"
          }
          subtitle="TC ile kayıtlı hastanın bilgilerini otomatik getirebilirsiniz."
          onClose={
            () =>
              setModal(null)
          }
        >

          <form
            className="admin-form"
            onSubmit={
              (event) => {
                event.preventDefault();

                saveResource(
                  "repairs",
                  repairForm
                );
              }
            }
          >

            <div className="admin-form-grid">

              <Field label="TC Kimlik No">

                <div className="admin-inline-field">

                  <input
                    value={
                      repairForm.tc_identity
                    }
                    onChange={
                      (event) =>
                        setRepairForm({
                          ...repairForm,

                          tc_identity:
                            event.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                11
                              ),
                        })
                    }
                    maxLength={11}
                    inputMode="numeric"
                    required
                  />


                  <button
                    type="button"
                    onClick={
                      lookupPatientForRepair
                    }
                    disabled={
                      patientLookupLoading
                    }
                  >
                    {patientLookupLoading
                      ? "Aranıyor..."
                      : "Hastayı Getir"}
                  </button>

                </div>

              </Field>


              <Field label="Ad Soyad">

                <input
                  value={
                    repairForm.full_name
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        full_name:
                          event.target.value,
                      })
                  }
                  required
                />

              </Field>


              <Field label="Telefon">

                <input
                  value={
                    repairForm.phone
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        phone:
                          event.target.value,
                      })
                  }
                />

              </Field>


              <Field label="Cihaz">

                <input
                  value={
                    repairForm.device_name
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        device_name:
                          event.target.value,
                      })
                  }
                />

              </Field>


              <Field label="Tamire Gönderilen Tarih">

                <input
                  type="date"
                  value={
                    repairForm.sent_date
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        sent_date:
                          event.target.value,
                      })
                  }
                  required
                />

              </Field>


              <Field label="Durum">

                <select
                  value={
                    repairForm.status
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        status:
                          event.target.value,
                      })
                  }
                >

                  {REPAIR_STATUSES.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

              </Field>


              <Field
                label="Açıklama"
                full
              >

                <textarea
                  value={
                    repairForm.description
                  }
                  onChange={
                    (event) =>
                      setRepairForm({
                        ...repairForm,

                        description:
                          event.target.value,
                      })
                  }
                  rows={5}
                />

              </Field>

            </div>


            {formError && (

              <div className="admin-form-error">
                {formError}
              </div>

            )}


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={
                  () =>
                    setModal(null)
                }
              >
                Vazgeç
              </button>


              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Kaydediliyor..."
                  : "Kaydet"}
              </button>

            </div>

          </form>

        </Modal>

      )}


      {modal === "inventory" && (

        <Modal
          title={
            inventoryForm.id
              ? "Stok Kaydını Düzenle"
              : "Envantere Yeni Ürün Ekle"
          }
          subtitle="İşitme Cihazı kategorisindeki ürünler hasta kayıt ekranında otomatik görünür."
          onClose={
            () =>
              setModal(null)
          }
        >

          <form
            className="admin-form"
            onSubmit={
              (event) => {
                event.preventDefault();

                saveResource(
                  "inventory",
                  inventoryForm
                );
              }
            }
          >

            <div className="admin-form-grid">

              <Field label="Marka">

                <select
                  value={
                    inventoryForm.brand
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        brand:
                          event.target.value,
                      })
                  }
                  required
                >

                  {BRANDS.map(
                    (brand) => (

                      <option
                        key={brand}
                        value={brand}
                      >
                        {brand}
                      </option>

                    )
                  )}

                </select>

              </Field>


              <Field label="Model / Ürün Adı">

                <input
                  value={
                    inventoryForm.product_name
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        product_name:
                          event.target.value,
                      })
                  }
                  placeholder="Örn. Moxi V5-R"
                  required
                />

              </Field>


              <Field label="Kategori">

                <select
                  value={
                    inventoryForm.category
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        category:
                          event.target.value,
                      })
                  }
                  required
                >

                  {CATEGORIES.map(
                    (category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    )
                  )}

                </select>

              </Field>


              <Field label="Mevcut Stok">

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    inventoryForm.stock_quantity
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        stock_quantity:
                          event.target.value === ""
                            ? ""
                            : Number(
                                event.target.value
                              ),
                      })
                  }
                  required
                />

              </Field>


              <Field label="Minimum Stok Uyarısı">

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    inventoryForm.minimum_stock
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        minimum_stock:
                          event.target.value === ""
                            ? ""
                            : Number(
                                event.target.value
                              ),
                      })
                  }
                  required
                />

              </Field>


              <Field
                label="Not"
                full
              >

                <textarea
                  value={
                    inventoryForm.notes
                  }
                  onChange={
                    (event) =>
                      setInventoryForm({
                        ...inventoryForm,

                        notes:
                          event.target.value,
                      })
                  }
                  rows={4}
                />

              </Field>

            </div>


            {formError && (

              <div className="admin-form-error">
                {formError}
              </div>

            )}


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={
                  () =>
                    setModal(null)
                }
              >
                Vazgeç
              </button>


              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Kaydediliyor..."
                  : "Kaydet"}
              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>
  );
}