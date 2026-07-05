create extension if not exists pgcrypto;
create table if not exists public.place_candidates (
 id uuid primary key default gen_random_uuid(), google_place_id text not null unique, google_resource_name text,
 display_name text not null, normalized_name text, city text not null default 'osaka', ward text, ward_slug text,
 formatted_address text, latitude double precision, longitude double precision, primary_type text, types text[],
 business_status text, google_maps_uri text, website_uri text, source_queries text[] default '{}', sources text[] default '{}',
 keyword_hits jsonb default '{}'::jsonb, candidate_score integer not null default 0 check(candidate_score between 0 and 100),
 candidate_status text not null default 'candidate' check(candidate_status in ('candidate','needs_manual_review','likely_relevant','low_confidence','rejected','imported_to_shops')),
 manual_check_status text not null default 'unchecked' check(manual_check_status in ('unchecked','checking','confirmed_official','confirmed_review','not_found','closed','duplicate','rejected')),
 manual_notes text, verified_source_url text, verified_source_label text, verified_at timestamptz,
 first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(), details_fetched_at timestamptz, exported_at timestamptz,
 imported_shop_id uuid references public.shops(id), imported_to_shops_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists place_candidates_review_idx on public.place_candidates(candidate_status,manual_check_status,candidate_score desc);
alter table public.place_candidates enable row level security;
-- Service Roleだけで運用する。公開読み取りポリシーは意図的に作成しない。
