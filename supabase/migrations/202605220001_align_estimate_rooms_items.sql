-- Align estimate relational schema: estimates -> rooms -> items

create extension if not exists pgcrypto;

alter table public.estimates
  add column if not exists total_cost numeric default 0,
  add column if not exists refurb_budget numeric default 0,
  add column if not exists gdv numeric,
  add column if not exists max_purchase_price numeric,
  add column if not exists projected_profit numeric;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  name text not null,
  total_cost numeric not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  category text not null default 'Materials',
  quantity numeric not null default 1,
  unit_cost numeric not null default 0,
  unit text not null default 'unit',
  total_cost numeric not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists rooms_estimate_id_idx on public.rooms(estimate_id);
create index if not exists rooms_display_order_idx on public.rooms(estimate_id, display_order);
create index if not exists items_room_id_idx on public.items(room_id);
create index if not exists items_display_order_idx on public.items(room_id, display_order);

alter table public.rooms enable row level security;
alter table public.items enable row level security;

drop policy if exists "Users can read own rooms" on public.rooms;
drop policy if exists "Users can insert own rooms" on public.rooms;
drop policy if exists "Users can update own rooms" on public.rooms;
drop policy if exists "Users can delete own rooms" on public.rooms;

drop policy if exists "Users can read own items" on public.items;
drop policy if exists "Users can insert own items" on public.items;
drop policy if exists "Users can update own items" on public.items;
drop policy if exists "Users can delete own items" on public.items;

create policy "Users can read own rooms"
on public.rooms
for select
using (
  exists (
    select 1
    from public.estimates e
    join public.properties p on p.id = e.property_id
    where e.id = rooms.estimate_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can insert own rooms"
on public.rooms
for insert
with check (
  exists (
    select 1
    from public.estimates e
    join public.properties p on p.id = e.property_id
    where e.id = rooms.estimate_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can update own rooms"
on public.rooms
for update
using (
  exists (
    select 1
    from public.estimates e
    join public.properties p on p.id = e.property_id
    where e.id = rooms.estimate_id
    and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.estimates e
    join public.properties p on p.id = e.property_id
    where e.id = rooms.estimate_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can delete own rooms"
on public.rooms
for delete
using (
  exists (
    select 1
    from public.estimates e
    join public.properties p on p.id = e.property_id
    where e.id = rooms.estimate_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can read own items"
on public.items
for select
using (
  exists (
    select 1
    from public.rooms r
    join public.estimates e on e.id = r.estimate_id
    join public.properties p on p.id = e.property_id
    where r.id = items.room_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can insert own items"
on public.items
for insert
with check (
  exists (
    select 1
    from public.rooms r
    join public.estimates e on e.id = r.estimate_id
    join public.properties p on p.id = e.property_id
    where r.id = items.room_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can update own items"
on public.items
for update
using (
  exists (
    select 1
    from public.rooms r
    join public.estimates e on e.id = r.estimate_id
    join public.properties p on p.id = e.property_id
    where r.id = items.room_id
    and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.rooms r
    join public.estimates e on e.id = r.estimate_id
    join public.properties p on p.id = e.property_id
    where r.id = items.room_id
    and p.user_id = auth.uid()
  )
);

create policy "Users can delete own items"
on public.items
for delete
using (
  exists (
    select 1
    from public.rooms r
    join public.estimates e on e.id = r.estimate_id
    join public.properties p on p.id = e.property_id
    where r.id = items.room_id
    and p.user_id = auth.uid()
  )
);
