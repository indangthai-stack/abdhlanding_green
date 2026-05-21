-- ÁO BÓNG ĐÁ HUẾ landing page schema.
-- Run via Supabase SQL Editor or `npx supabase db push` once the project
-- is linked.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- Reference tables (price grouping + qty tiering)
-- ---------------------------------------------------------------------

create table if not exists pricing_groups (
  group_key      text primary key check (group_key in ('A','B','C','D')),
  label          text not null,
  description    text,
  cost_base_vnd  integer not null check (cost_base_vnd > 0),
  sort_order     integer not null default 0
);

create table if not exists pricing_tiers (
  id          bigserial primary key,
  tier_key    text not null unique,
  qty_min     integer not null,
  qty_max     integer,
  margin_vnd  integer not null check (margin_vnd > 0),
  label       text not null,
  description text,
  perks       text[] not null default '{}',
  is_popular  boolean not null default false,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------

create table if not exists brands (
  id          bigserial primary key,
  slug        text not null unique,
  name        text not null,
  group_key   text not null references pricing_groups(group_key),
  logo_url    text,
  description text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id                bigserial primary key,
  slug              text not null unique,
  name              text not null,
  brand_id          bigint references brands(id) on delete set null,
  group_key         text references pricing_groups(group_key),
  primary_color     text,
  color_hex         text,
  fit               text check (fit in ('om','tieu_chuan','dai_tay')),
  retail_price_vnd  integer check (retail_price_vnd is null or retail_price_vnd > 0),
  image_url         text,
  image_urls        text[] not null default '{}',
  image_alt         text,
  badge             text,
  is_bestseller     boolean not null default false,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now()
);

create index if not exists products_active_idx on products(is_active);
create index if not exists products_brand_idx on products(brand_id);
create index if not exists products_group_idx on products(group_key);

-- ---------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------

create table if not exists testimonials (
  id            bigserial primary key,
  customer_name text not null,
  fc_name       text,
  location      text,
  content       text not null,
  rating        smallint not null check (rating between 1 and 5) default 5,
  qty           integer,
  brand_name    text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists faqs (
  id         bigserial primary key,
  question   text not null,
  answer     text not null,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_config (
  key   text primary key,
  value jsonb not null
);

-- ---------------------------------------------------------------------
-- Leads (only writable via the API; readable to admins)
-- ---------------------------------------------------------------------

create type lead_status as enum ('new', 'contacted', 'won', 'lost');

create table if not exists leads (
  id                     bigserial primary key,
  customer_name          text not null,
  phone                  text not null,
  fc_name                text,
  qty_tier               text,
  selected_product_slug  text,
  message                text,
  source                 text,
  metadata               jsonb not null default '{}'::jsonb,
  status                 lead_status not null default 'new',
  created_at             timestamptz not null default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_idx on leads(created_at desc);

-- ---------------------------------------------------------------------
-- RLS — public can read catalogue; only authenticated admins can write.
-- ---------------------------------------------------------------------

alter table brands          enable row level security;
alter table products        enable row level security;
alter table pricing_groups  enable row level security;
alter table pricing_tiers   enable row level security;
alter table testimonials    enable row level security;
alter table faqs            enable row level security;
alter table site_config     enable row level security;
alter table leads           enable row level security;

-- Read policies — anyone can read the catalogue.
create policy "Public read brands"        on brands         for select using (is_active);
create policy "Public read products"      on products       for select using (is_active);
create policy "Public read groups"        on pricing_groups for select using (true);
create policy "Public read tiers"         on pricing_tiers  for select using (true);
create policy "Public read testimonials"  on testimonials   for select using (is_active);
create policy "Public read faqs"          on faqs           for select using (is_active);
create policy "Public read site_config"   on site_config    for select using (true);

-- Leads — public can INSERT (so the form works) but cannot read each other's.
create policy "Public insert leads"       on leads          for insert with check (true);
create policy "Authenticated read leads"  on leads          for select using (auth.role() = 'authenticated');

-- Admin policies — authenticated users (with role mapping in Supabase Auth) can write.
create policy "Admin write brands"        on brands         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write products"      on products       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write groups"        on pricing_groups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write tiers"         on pricing_tiers  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write testimonials"  on testimonials   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write faqs"          on faqs           for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write site_config"   on site_config    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write leads"         on leads          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
