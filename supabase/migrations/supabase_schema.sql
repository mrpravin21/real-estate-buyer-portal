
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  name varchar(255) not null,
  role varchar(64) not null default 'buyer',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text not null,
  location varchar(255) not null,
  price integer not null,
  image_url varchar(512),
  area_sqft integer,
  bedrooms integer,
  bathrooms integer,
  parking_spots integer,
  floors integer,
  distance_mart_m integer,
  distance_hospital_m integer,
  facing varchar(64),
  year_built integer,
  created_at timestamptz not null default now()
);

create table if not exists favourites (
  user_id uuid not null references users (id) on delete cascade,
  property_id uuid not null references properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index if not exists idx_favourites_user on favourites (user_id);
