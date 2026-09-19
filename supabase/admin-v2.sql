-- =========================================================
-- DUYANT ADMIN V2
-- Hasta Profili + Cihaz + Garanti + Ödeme + Randevu
-- =========================================================


-- =========================================================
-- 1. HASTA CİHAZ DETAYLARI
-- =========================================================

alter table public.patients
add column if not exists device_side text;

alter table public.patients
add column if not exists right_serial_number text;

alter table public.patients
add column if not exists left_serial_number text;

alter table public.patients
add column if not exists power_type text;

alter table public.patients
add column if not exists battery_size text;

alter table public.patients
add column if not exists warranty_start_date date;

alter table public.patients
add column if not exists warranty_end_date date;


-- ---------------------------------------------------------
-- SAĞ / SOL / ÇİFT KONTROLÜ
-- ---------------------------------------------------------

alter table public.patients
drop constraint if exists patients_device_side_check;

alter table public.patients
add constraint patients_device_side_check
check (
  device_side is null
  or device_side in (
    'Sağ',
    'Sol',
    'Çift'
  )
);


-- ---------------------------------------------------------
-- PİLLİ / ŞARJLI
-- ---------------------------------------------------------

alter table public.patients
drop constraint if exists patients_power_type_check;

alter table public.patients
add constraint patients_power_type_check
check (
  power_type is null
  or power_type in (
    'Pilli',
    'Şarjlı'
  )
);


-- ---------------------------------------------------------
-- PİL NUMARASI
-- ---------------------------------------------------------

alter table public.patients
drop constraint if exists patients_battery_size_check;

alter table public.patients
add constraint patients_battery_size_check
check (
  battery_size is null
  or battery_size in (
    '10',
    '13',
    '312',
    '675'
  )
);


-- =========================================================
-- 2. ÖDEME / TAHSİLAT KAYITLARI
-- =========================================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),

  patient_id uuid not null
    references public.patients(id)
    on delete cascade,

  amount numeric(12,2) not null
    check (amount > 0),

  payment_date date not null
    default current_date,

  payment_method text not null
    default 'Nakit',

  note text,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);


alter table public.payments
drop constraint if exists payments_method_check;

alter table public.payments
add constraint payments_method_check
check (
  payment_method in (
    'Nakit',
    'Kart',
    'Havale/EFT',
    'Diğer'
  )
);


create index if not exists payments_patient_id_idx
on public.payments(patient_id);


create index if not exists payments_payment_date_idx
on public.payments(payment_date);


-- =========================================================
-- 3. RANDEVU / KONTROL / AYAR KAYITLARI
-- =========================================================

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),

  patient_id uuid not null
    references public.patients(id)
    on delete cascade,

  appointment_at timestamptz not null,

  appointment_type text not null
    default 'Kontrol',

  status text not null
    default 'Planlandı',

  notes text,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);


alter table public.appointments
drop constraint if exists appointments_type_check;

alter table public.appointments
add constraint appointments_type_check
check (
  appointment_type in (
    'Kontrol',
    'Ayar',
    'Bakım',
    'Teslim',
    'Telefon Görüşmesi',
    'Diğer'
  )
);


alter table public.appointments
drop constraint if exists appointments_status_check;

alter table public.appointments
add constraint appointments_status_check
check (
  status in (
    'Planlandı',
    'Tamamlandı',
    'İptal'
  )
);


create index if not exists appointments_patient_id_idx
on public.appointments(patient_id);


create index if not exists appointments_appointment_at_idx
on public.appointments(appointment_at);


create index if not exists appointments_status_idx
on public.appointments(status);


-- =========================================================
-- 4. UPDATED_AT
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


drop trigger if exists payments_set_updated_at
on public.payments;

create trigger payments_set_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();


drop trigger if exists appointments_set_updated_at
on public.appointments;

create trigger appointments_set_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();


-- =========================================================
-- 5. GÜVENLİK
-- PUBLIC / ANON ERİŞİM YOK
-- =========================================================

alter table public.payments
enable row level security;

alter table public.appointments
enable row level security;


-- =========================================================
-- 6. FİNANSAL ÖZET
--
-- Hasta:
-- Satış: 30.000
-- Tahsilat: 20.000
-- Kalan: 10.000
-- Durum: Kısmi
-- =========================================================

create or replace view public.patient_financial_summary
with (security_invoker = true)
as

select
  p.id as patient_id,

  coalesce(
    p.sale_price,
    0
  ) as sale_price,

  coalesce(
    sum(pay.amount),
    0
  ) as total_paid,

  greatest(
    coalesce(
      p.sale_price,
      0
    )
    -
    coalesce(
      sum(pay.amount),
      0
    ),
    0
  ) as remaining_amount,

  case

    when
      coalesce(
        sum(pay.amount),
        0
      ) <= 0
      then 'Bekliyor'

    when
      coalesce(
        sum(pay.amount),
        0
      )
      <
      coalesce(
        p.sale_price,
        0
      )
      then 'Kısmi'

    else 'Ödendi'

  end as payment_status

from public.patients p

left join public.payments pay
  on pay.patient_id = p.id

group by
  p.id,
  p.sale_price;


-- =========================================================
-- 7. SERİ NO ARAMALARINI HIZLANDIR
-- =========================================================

create index if not exists patients_right_serial_number_idx
on public.patients(right_serial_number);


create index if not exists patients_left_serial_number_idx
on public.patients(left_serial_number);


-- =========================================================
-- BİTTİ
-- =========================================================