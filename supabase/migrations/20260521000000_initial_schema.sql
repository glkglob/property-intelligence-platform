-- =============================================================================
-- Initial schema for Property Intelligence Platform
-- Applied via: supabase db push  (or paste into Supabase SQL editor)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared utility: keep updated_at current on every row change
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =============================================================================
-- properties
-- =============================================================================
create table properties (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade
                          default auth.uid(),
  address     text        not null,
  postcode    text        not null,
  type        text        not null,
  bedrooms    integer     not null check (bedrooms > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- fast lookup of all properties belonging to the current user
create index properties_user_id_idx     on properties (user_id);
-- supports ORDER BY created_at DESC (properties list page)
create index properties_created_at_idx  on properties (created_at desc);

create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();

alter table properties enable row level security;

create policy "properties: select own"
  on properties for select
  using (user_id = auth.uid());

create policy "properties: insert own"
  on properties for insert
  with check (user_id = auth.uid());

create policy "properties: update own"
  on properties for update
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "properties: delete own"
  on properties for delete
  using (user_id = auth.uid());


-- =============================================================================
-- estimates
-- =============================================================================
-- description stores the human-readable line-item summary sent by the client
-- (e.g. "Kitchen renovation ×1; Full rewiring ×1").
-- Use text rather than jsonb because the current app sends a plain string.
-- Migrate to jsonb when the client serialises structured items.

create table estimates (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users(id) on delete cascade
                                  default auth.uid(),
  property_id         uuid        not null references properties(id) on delete cascade,
  description         text        not null,
  refurb_budget       numeric,
  total_cost          numeric     not null,
  gdv                 numeric,
  max_purchase_price  numeric,
  projected_profit    numeric,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index estimates_user_id_idx on estimates (user_id);
create index estimates_property_id_idx on estimates (property_id);
-- composite index supports "latest estimate for a given property" query:
--   .eq('property_id', id).order('created_at', { ascending: false }).limit(1)
create index estimates_property_created_idx on estimates (property_id, created_at desc);

create trigger estimates_set_updated_at
  before update on estimates
  for each row execute function set_updated_at();

alter table estimates enable row level security;

create policy "estimates: select own"
  on estimates for select
  using (user_id = auth.uid());

create policy "estimates: insert own"
  on estimates for insert
  with check (user_id = auth.uid());

create policy "estimates: update own"
  on estimates for update
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "estimates: delete own"
  on estimates for delete
  using (user_id = auth.uid());


-- =============================================================================
-- deals
-- Routes are gated (ComingSoonCard). Table included for type-parity with
-- src/types/deal.ts. No app queries yet; RLS is still enforced.
-- =============================================================================
create table deals (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade
                              default auth.uid(),
  property_id     uuid        not null references properties(id) on delete cascade,
  estimate_id     uuid        not null references estimates(id) on delete cascade,
  score           numeric     not null,
  recommendation  text        not null check (recommendation in ('proceed', 'review', 'reject')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index deals_user_id_idx     on deals (user_id);
create index deals_property_id_idx on deals (property_id);

create trigger deals_set_updated_at
  before update on deals
  for each row execute function set_updated_at();

alter table deals enable row level security;

create policy "deals: select own"
  on deals for select
  using (user_id = auth.uid());

create policy "deals: insert own"
  on deals for insert
  with check (user_id = auth.uid());

create policy "deals: update own"
  on deals for update
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "deals: delete own"
  on deals for delete
  using (user_id = auth.uid());
