-- Aufträge (z. B. NBC-Auftragsmails) bis zur versendeten Rechnung.
-- Zugriff nur serverseitig über den Service-Role-Key: RLS ist an, es gibt keine Policies.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status text not null default 'neu'
    check (status in ('neu', 'erledigt', 'gesendet', 'storniert')),
  source text not null default 'manuell'
    check (source in ('mail', 'manuell')),

  -- Auftragsmail
  mail_message_id text unique,
  mail_from text,
  mail_subject text,
  mail_received_at timestamptz,
  mail_text text,
  order_mail_path text,

  -- Auftrag
  object_address text not null default '',
  task text,
  recipient_email text,

  -- Erledigung
  work_date date,
  hours numeric(6, 2) check (hours is null or hours > 0),
  sas_gross numeric(10, 2) check (sas_gross is null or sas_gross >= 0),
  disposal_net numeric(10, 2) check (disposal_net is null or disposal_net >= 0),
  sas_receipt_path text,

  -- Rechnung
  lexware_invoice_id text,
  invoice_number text,
  invoice_pdf_path text,
  sent_at timestamptz,

  notes text
);

create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

alter table public.orders enable row level security;

create or replace function public.orders_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.orders_touch_updated_at();

-- Privater Speicher für Auftragsmail-PDFs, SAS-Belege und Rechnungs-PDFs.
insert into storage.buckets (id, name, public, file_size_limit)
values ('orders', 'orders', false, 26214400)
on conflict (id) do nothing;
