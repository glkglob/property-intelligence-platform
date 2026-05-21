-- =============================================================================
-- profiles
-- One row per auth.users entry; id = auth.uid().
-- No user_id column — the PK is the FK to auth.users.
-- Note: handle_updated_at() duplicates set_updated_at() from 00000.
--       Both are kept so this file can be applied independently.
-- =============================================================================

-- 1. Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',  -- e.g. free / pro / enterprise
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- Optional: Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on profiles
  for each row execute procedure public.handle_updated_at();
