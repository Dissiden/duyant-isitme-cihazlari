-- =========================================================
-- DUYANT İŞİTME CİHAZLARI
-- ADMIN PANELİ VERİTABANI
-- =========================================================


-- =========================================================
-- HASTALAR
-- =========================================================

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,

  tc_identity text not null unique,

  phone text,

  address text,

  device_name text,

  report_status text not null default 'Raporsuz'
    check (
      report_status in (
        'Raporlu',
        'Raporsuz'
      )
    ),

  purchase_date date,

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- TC aramalarını hızlandırır
create index if not exists patients_tc_identity_idx
on public.patients(tc_identity);


-- Ad Soyad aramalarını hızlandırır
create index if not exists patients_full_name_idx
on public.patients(full_name);


-- =========================================================
-- TAMİR KAYITLARI
-- =========================================================

create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),

  patient_id uuid
    references public.patients(id)
    on delete set null,

  tc_identity text not null,

  full_name text not null,

  phone text,

  device_name text,

  sent_date date not null,

  status text not null default 'Tamire Gönderildi'
    check (
      status in (
        'Tamire Gönderildi',
        'Serviste',
        'Tamir Tamamlandı',
        'Teslim Edildi'
      )
    ),

  description text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


create index if not exists repairs_tc_identity_idx
on public.repairs(tc_identity);


create index if not exists repairs_patient_id_idx
on public.repairs(patient_id);


-- =========================================================
-- ENVANTER / STOK
-- =========================================================

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),

  product_name text not null,

  brand text,

  category text,

  stock_quantity integer not null default 0
    check (stock_quantity >= 0),

  minimum_stock integer not null default 0
    check (minimum_stock >= 0),

  notes text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


create index if not exists inventory_product_name_idx
on public.inventory(product_name);


-- =========================================================
-- UPDATED_AT OTOMATİK GÜNCELLEME
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists patients_set_updated_at
on public.patients;

create trigger patients_set_updated_at
before update on public.patients
for each row
execute function public.set_updated_at();


drop trigger if exists repairs_set_updated_at
on public.repairs;

create trigger repairs_set_updated_at
before update on public.repairs
for each row
execute function public.set_updated_at();


drop trigger if exists inventory_set_updated_at
on public.inventory;

create trigger inventory_set_updated_at
before update on public.inventory
for each row
execute function public.set_updated_at();