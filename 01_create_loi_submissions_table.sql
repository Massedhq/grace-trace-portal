-- Run this once against your Neon Postgres database
-- (Neon SQL editor, or psql, or however you normally run migrations)

CREATE TABLE IF NOT EXISTS loi_submissions (
  id SERIAL PRIMARY KEY,
  org_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  city TEXT NOT NULL,
  per_month TEXT,
  per_year TEXT,
  population TEXT,
  signature TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

