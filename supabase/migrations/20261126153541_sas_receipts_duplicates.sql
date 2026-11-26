-- Dubletten erkennen: gleiche Datei (Hash) oder gleicher Beleg (Nummer + Datum)
alter table public.sas_receipts
  add column if not exists file_hash text,
  add column if not exists duplicate_of uuid references public.sas_receipts(id) on delete set null;

alter table public.sas_receipts drop constraint if exists sas_receipts_status_check;
alter table public.sas_receipts add constraint sas_receipts_status_check
  check (status in ('neu', 'gelesen', 'zugeordnet', 'doppelt', 'fehler'));

create index if not exists sas_receipts_file_hash_idx on public.sas_receipts (file_hash);
create index if not exists sas_receipts_number_date_idx on public.sas_receipts (receipt_number, receipt_date);
