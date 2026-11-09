-- 20261101120700_grants_versions.sql
-- Per-Tome access grants, version history, autolinker ignore list.

create table tome_access_grants (
  id         uuid primary key default uuidv7(),
  tome_id    uuid not null references tomes(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  can_edit   boolean not null default false,
  created_at timestamptz not null default now(),

  constraint grant_unique unique (tome_id, user_id)
);

create index tome_access_grants_user_idx on tome_access_grants (user_id);

-- ---------------------------------------------------------------------------
-- Version history: hybrid storage.
--
-- Deltas every editing session, plus a full snapshot every N sessions and on
-- every publish. Reconstruction replays at most N sessions of deltas from the
-- nearest snapshot, which keeps full-document diffs and point-in-time views
-- practical. N starts at 10; tune after measuring.
--
-- A session boundary is computed from timestamps at save time -- a gap over
-- 30 minutes starts a new version. Not from client events: beforeunload is
-- skipped on mobile and a sleeping laptop fires nothing.
-- ---------------------------------------------------------------------------
create table tome_versions (
  id         uuid primary key default uuidv7(),
  tome_id    uuid not null references tomes(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  started_at timestamptz not null default now(),
  ended_at   timestamptz not null default now(),

  -- Full copy of all blocks. Written on snapshot sessions and on every
  -- publish; null on delta-only sessions.
  snapshot   jsonb,

  -- Publish snapshots are never reaped by the 30-day retention job.
  is_publish boolean not null default false
);

create index versions_tome_idx on tome_versions (tome_id, started_at desc);

create table tome_version_deltas (
  id         uuid primary key default uuidv7(),
  version_id uuid not null references tome_versions(id) on delete cascade,

  -- Deliberately not a foreign key: the block this delta describes may have
  -- been deleted, and the delta is how it gets restored.
  block_id   uuid not null,

  op         text  not null check (op in ('insert', 'update', 'delete')),
  before     jsonb,   -- null for insert
  after      jsonb,   -- null for delete
  created_at timestamptz not null default now()
);

create index deltas_version_idx on tome_version_deltas (version_id);

-- Terms the user has rejected as autolink candidates, per Tome.
create table autolink_ignores (
  tome_id    uuid not null references tomes(id) on delete cascade,
  term       text not null,
  created_at timestamptz not null default now(),
  primary key (tome_id, term)
);