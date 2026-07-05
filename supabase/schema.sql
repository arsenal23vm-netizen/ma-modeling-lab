create extension if not exists pgcrypto;
create type verification_status as enum ('verified_official','verified_review','needs_confirmation','possibly_discontinued');
create type honey_status as enum ('included','available','unknown','not_available');
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  city text not null default 'osaka' check (city <> ''), ward text not null, ward_slug text not null,
  address text not null, nearest_station text, latitude double precision not null check(latitude between -90 and 90), longitude double precision not null check(longitude between -180 and 180),
  google_place_id text unique, google_maps_url text, google_rating numeric(2,1) check(google_rating between 0 and 5), google_review_count integer check(google_review_count >= 0),
  website_url text, instagram_url text, verification_status verification_status not null default 'needs_confirmation',
  verification_source_label text, verification_source_url text, last_verified_at date,
  quattro_price_text text, cheese_description text, honey_status honey_status not null default 'unknown',
  lunch_available boolean, takeout_available boolean, opening_hours_text text, description text not null,
  notes text, published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index shops_published_ward_idx on public.shops (published, city, ward_slug);
create function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger shops_set_updated_at before update on public.shops for each row execute function public.set_updated_at();
alter table public.shops enable row level security;
create policy "Published shops are readable" on public.shops for select using (published = true);
