-- Étape 1 : comptes utilisateurs (déjà appliquée sur la base Supabase connectée).
-- Pseudonyme public, identité privée, rôles de modération.
begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_pseudonym text not null
    check (char_length(public_pseudonym) between 3 and 24
           and public_pseudonym ~ '^[A-Za-z0-9_.-]+$'),
  preferred_language text not null default 'fr'
    check (preferred_language in ('fr', 'sw', 'ki')),
  created_at timestamptz not null default now()
);
create unique index profiles_pseudonym_lower_key on public.profiles (lower(public_pseudonym));

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select (id, public_pseudonym, created_at) on public.profiles to anon, authenticated;
grant select (preferred_language) on public.profiles to authenticated;
grant update (public_pseudonym, preferred_language) on public.profiles to authenticated;
create policy "profiles_public_read" on public.profiles for select to anon, authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Identité réelle : lisible et modifiable uniquement par son propriétaire.
create table public.profile_identity (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  phone text check (phone is null or phone ~ '^\+?[0-9 ]{6,20}$'),
  updated_at timestamptz not null default now()
);
alter table public.profile_identity enable row level security;
revoke all on public.profile_identity from anon, authenticated;
grant select on public.profile_identity to authenticated;
grant update (first_name, last_name, phone, updated_at) on public.profile_identity to authenticated;
create policy "identity_select_own" on public.profile_identity for select to authenticated using (auth.uid() = user_id);
create policy "identity_update_own" on public.profile_identity for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Rôles attribués uniquement côté serveur (aucun droit d'écriture pour les utilisateurs).
create type public.app_role as enum ('moderator', 'admin');
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);
alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;
create policy "roles_select_own" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(check_role public.app_role)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and (role = check_role or role = 'admin')
  );
$$;
revoke all on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to authenticated;

create or replace function public.is_pseudonym_available(candidate text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select char_length(candidate) between 3 and 24
     and candidate ~ '^[A-Za-z0-9_.-]+$'
     and not exists (select 1 from public.profiles where lower(public_pseudonym) = lower(candidate));
$$;
revoke all on function public.is_pseudonym_available(text) from public;
grant execute on function public.is_pseudonym_available(text) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  wanted text := nullif(trim(new.raw_user_meta_data ->> 'public_pseudonym'), '');
  final_pseudonym text;
begin
  if wanted is null or char_length(wanted) not between 3 and 20 or wanted !~ '^[A-Za-z0-9_.-]+$' then
    wanted := 'membre';
  end if;
  final_pseudonym := wanted;
  while exists (select 1 from public.profiles where lower(public_pseudonym) = lower(final_pseudonym)) loop
    final_pseudonym := left(wanted, 19) || '_' || substr(md5(random()::text), 1, 4);
  end loop;

  insert into public.profiles (id, public_pseudonym)
  values (new.id, final_pseudonym)
  on conflict (id) do nothing;

  insert into public.profile_identity (user_id, first_name, last_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''), '-'), 80),
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''), '-'), 80)
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
