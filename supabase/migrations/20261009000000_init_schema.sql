-- =============================================================
-- KmerLife: Initial Schema
-- Migration: 20261009000000_init_schema.sql
-- Owner: DEV-04
-- Currency: FCFA (bigint, never float)
-- =============================================================


-- ------------------------------------------------------------
-- characters
-- one character per user (UNIQUE on user_id)
-- references auth.users directly — no mirror table needed
-- ------------------------------------------------------------
CREATE TABLE characters (
  id                uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              text         NOT NULL,
  origin            text         NOT NULL CHECK (origin IN ('privileged', 'struggling')),
  city              text         NOT NULL CHECK (city IN ('yaounde', 'douala', 'buea')),
  fcfa              bigint       NOT NULL DEFAULT 0,
  energy            numeric(5,2) NOT NULL DEFAULT 100,
  job_id            text,
  housing_tier      smallint     NOT NULL DEFAULT 0,
  rent_arrears_fcfa bigint       NOT NULL DEFAULT 0,
  next_rent_due_at  timestamptz,
  last_accrued_at   timestamptz  NOT NULL DEFAULT now(),
  season_id         integer      NOT NULL DEFAULT 1,
  version           integer      NOT NULL DEFAULT 0,
  created_at        timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT characters_user_id_unique UNIQUE (user_id)
);

CREATE INDEX idx_characters_user_id ON characters(user_id);


-- ------------------------------------------------------------
-- action_log
-- idempotency: replaying the same key returns the stored result
-- ------------------------------------------------------------
CREATE TABLE action_log (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id  uuid        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  key        uuid        NOT NULL,
  action     jsonb       NOT NULL,
  result     jsonb       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT action_log_player_key_unique UNIQUE (player_id, key)
);

CREATE INDEX idx_action_log_player_id ON action_log(player_id);


-- ------------------------------------------------------------
-- transactions
-- signed ledger: positive = income, negative = spend
-- ------------------------------------------------------------
CREATE TABLE transactions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  delta_fcfa   bigint      NOT NULL,
  reason       text        NOT NULL,
  season_id    integer     NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_character_id ON transactions(character_id);


-- ------------------------------------------------------------
-- rent_ledger
-- one row per character per calendar day (Africa/Douala tz)
-- expression-based unique ensures DEV-06 idempotency
-- ------------------------------------------------------------
CREATE TABLE rent_ledger (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  amount       bigint      NOT NULL,
  charged_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT rent_ledger_character_day_unique
    UNIQUE (character_id, (charged_at AT TIME ZONE 'Africa/Douala')::date)
);

CREATE INDEX idx_rent_ledger_character_id ON rent_ledger(character_id);


-- ------------------------------------------------------------
-- world_state
-- key/value store per city for world events and season data
-- ------------------------------------------------------------
CREATE TABLE world_state (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  city       text        NOT NULL CHECK (city IN ('yaounde', 'douala', 'buea')),
  key        text        NOT NULL,
  value      jsonb       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT world_state_city_key_unique UNIQUE (city, key)
);
