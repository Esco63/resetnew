-- Hochgeladene SAS-Belege (Wertstoffhof-Quittungen), ausgelesen per Claude
-- und einem Auftrag zugeordnet. Zugriff nur serverseitig (RLS ohne Policies).

create table if not exists public.sas_receipts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  file_path text not null,
  status text not null default 'neu'
    check (status in ('neu', 'gelesen', 'zugeordnet', 'fehler')),
  error text,

  receipt_date date,
  receipt_time text,
  receipt_number text,
  gross numeric(10, 2),
  net numeric(10, 2),
  vat numeric(10, 2),
  items jsonb,

  order_id uuid references public.orders(id) on delete set null
);

create index if not exists sas_receipts_status_date_idx
  on public.sas_receipts (status, receipt_date desc);
create unique index if not exists sas_receipts_order_idx
  on public.sas_receipts (order_id) where order_id is not null;

alter table public.sas_receipts enable row level security;

create or replace function public.sas_receipts_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sas_receipts_touch_updated_at on public.sas_receipts;
create trigger sas_receipts_touch_updated_at
  before update on public.sas_receipts
  for each row execute function public.sas_receipts_touch_updated_at();
