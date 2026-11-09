-- 20261101120400_tomes.sql
-- Tomes, aliases, tags.

create table tomes (
  id            uuid primary key default uuidv7(),
  world_id      uuid not null references worlds(id) on delete cascade,
  folder_id     uuid references folders(id) on delete set null,
  type          text not null,
  title         text not null,
  status        tome_status     not null default 'draft',
  visibility    tome_visibility not null default 'private',
  created_by    uuid not null references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz,
  published_by  uuid references auth.users(id),
  archived_at   timestamptz,

  -- The autolinker matches titles as well as aliases, so a duplicate title
  -- inside a World makes every occurrence of that phrase ambiguous.
  -- Per World, not per folder.
  constraint tomes_title_unique_per_world unique (world_id, title)
);

create index tomes_world_idx  on tomes (world_id) where archived_at is null;
create index tomes_folder_idx on tomes (folder_id);

-- Full-text search over titles. Block content is indexed separately.
alter table tomes add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A')
  ) stored;

create index tomes_search_idx on tomes using gin (search_vector);

create table tome_aliases (
  id         uuid primary key default uuidv7(),
  tome_id    uuid not null references tomes(id) on delete cascade,
  world_id   uuid not null references worlds(id) on delete cascade,
  alias      text not null,
  created_at timestamptz not null default now(),

  constraint tome_aliases_unique_per_world unique (world_id, alias)
);

create index tome_aliases_tome_idx on tome_aliases (tome_id);

-- Freeform. Normalized rather than a text[] column so "every tag in this
-- World, with counts" is a plain group-by.
create table tome_tags (
  tome_id    uuid not null references tomes(id) on delete cascade,
  world_id   uuid not null references worlds(id) on delete cascade,
  tag        text not null,
  created_at timestamptz not null default now(),
  primary key (tome_id, tag)
);

create index tome_tags_world_idx on tome_tags (world_id, tag);