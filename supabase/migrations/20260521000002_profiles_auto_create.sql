-- =============================================================================
-- Auto-create a profiles row whenever a user signs up via auth.users.
--
-- Why security definer:
--   This trigger fires from the auth system, not from a user session.
--   auth.uid() is null at trigger time, so the RLS insert policy
--   ("check auth.uid() = id") would reject a plain insert.
--   security definer runs as the function owner (postgres/superuser),
--   bypassing RLS for this function only. Normal app-level RLS is unchanged.
--
-- set search_path = '' forces fully-qualified names, preventing search-path
-- injection (Supabase recommended pattern for security definer functions).
-- =============================================================================

-- 1. Add email column to profiles (idempotent — safe to re-run)
alter table public.profiles
  add column if not exists email text;


-- 2. Function: insert a minimal profile row for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, subscription_tier)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;


-- 3. Trigger on auth.users
--    DROP IF EXISTS makes this re-runnable (triggers have no CREATE OR REPLACE).
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
