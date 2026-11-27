-- Base initiale : à exécuter dans le SQL Editor de votre projet Supabase.
create type public.report_category as enum (
  'traffic_jam', 'accident', 'road_blocked', 'hazard',
  'roadworks', 'weather', 'barge'
);

create type public.report_status as enum ('pending', 'published', 'rejected', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_pseudonym text not null unique,
  preferred_language text not null default 'fr'
    check (preferred_language in ('fr', 'sw', 'ki')),
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category public.report_category not null,
  comment text,
  latitude double precision not null check (latitude between -13.2 and -12.4),
  longitude double precision not null check (longitude between 44.8 and 45.6),
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  confirmed_count integer not null default 0
);

create table public.report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table public.report_confirmations (
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_still_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_media enable row level security;
alter table public.report_confirmations enable row level security;

-- Les politiques de lecture publique et de publication seront ajoutées
-- après définition du workflow de modération et des rôles administrateurs.
-- Ne pas activer les écritures publiques sans politiques RLS strictes.
