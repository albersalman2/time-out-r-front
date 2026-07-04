create table if not exists admin_users (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_email_idx
  on admin_users (lower(email));
