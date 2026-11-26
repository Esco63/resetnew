create table if not exists public.pricing_settings (
  id text primary key default 'default',
  settings jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.pricing_settings enable row level security;

drop policy if exists "Pricing settings are publicly readable" on public.pricing_settings;
create policy "Pricing settings are publicly readable"
  on public.pricing_settings
  for select
  using (true);

insert into public.pricing_settings (id, settings)
values (
  'default',
  '{
    "homepagePlans": [
      {
        "name": "Schnell & Klein",
        "priceFrom": 199,
        "points": ["Kellerabteil", "1-2m³ Entsorgung", "Besenrein"]
      },
      {
        "name": "Wohnung",
        "priceFrom": 799,
        "points": ["2-3 Zimmer", "Wertanrechnung möglich", "Besenrein + Entsorgung"],
        "featured": true
      },
      {
        "name": "Haus komplett",
        "priceFrom": 1999,
        "points": ["120-160 m²", "Mehrtageseinsatz", "inkl. Abtransport"]
      }
    ],
    "calculator": {
      "haushalt": {
        "basePerSqm": 18,
        "floorSurchargePctPerLevel": 4,
        "minPrice": 199
      },
      "entrumpelung": {
        "basePerSqm": 12,
        "floorSurchargePctPerLevel": 3,
        "minPrice": 149
      },
      "transporte": {
        "baseCityOnePickup": 79,
        "hourlyRate": 30,
        "kmRate": 1.2,
        "trailerExtra": 20
      }
    }
  }'::jsonb
)
on conflict (id) do nothing;
