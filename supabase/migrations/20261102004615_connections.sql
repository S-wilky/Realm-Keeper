-- 20261101120600_connections.sql
-- Typed relationships between Tomes, their published counterparts, and the
-- inline link index.

create table tome_connections (
  id                uuid primary key default uuidv7(),
  world_id          uuid not null references worlds(id) on delete cascade,
  from_tome_id      uuid not null references tomes(id) on delete cascade,
  to_tome_id        uuid not null references tomes(id) on delete cascade,
  relationship_type text not null,
  is_mutual         boolean not null default true,

  -- Connections are visible by default. A connection is hidden only when
  -- explicitly marked secret, or when the Tome on the other end is not
  -- visible to that viewer -- which the target Tome's own policy handles.
  is_secret         boolean not null default false,

  created_at        timestamptz not null default now(),

  constraint no_self_connection check (from_tome_id <> to_tome_id),
  constraint connection_unique
    unique (from_tome_id, to_tome_id, relationship_type)
);

create index connections_from_idx on tome_connections (from_tome_id);
create index connections_to_idx   on tome_connections (to_tome_id);

-- Connections diverge with content: readers see the published set.
create table published_connections (
  id                uuid primary key,
  world_id          uuid not null references worlds(id) on delete cascade,
  from_tome_id      uuid not null references tomes(id) on delete cascade,
  to_tome_id        uuid not null references tomes(id) on delete cascade,
  relationship_type text not null,
  is_mutual         boolean not null default true,
  is_secret         boolean not null default false,
  published_at      timestamptz not null default now()
);

create index published_connections_from_idx
  on published_connections (from_tome_id);

-- ---------------------------------------------------------------------------
-- Inline link index.
--
-- Inline links live inside block content JSON, which cannot answer
-- "what links to this Tome?" without scanning every block in the World.
-- That question is required for deletion warnings and broken-link indicators,
-- so the links are mirrored here by trigger on every block write.
--
-- to_tome_id cascades on delete, so the index self-cleans. The link mark
-- stays inside the source block's JSON and renders as a broken link --
-- rewriting another user's block content on delete would be worse.
-- ---------------------------------------------------------------------------
create table tome_links (
  from_tome_id  uuid not null references tomes(id)  on delete cascade,
  from_block_id uuid not null references blocks(id) on delete cascade,
  to_tome_id    uuid not null references tomes(id)  on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (from_block_id, to_tome_id)
);

create index tome_links_to_idx   on tome_links (to_tome_id);
create index tome_links_from_idx on tome_links (from_tome_id);