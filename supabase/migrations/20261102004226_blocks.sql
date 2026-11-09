-- 20261101120500_blocks.sql
-- Draft blocks and their published counterparts.

create table blocks (
  id              uuid primary key default uuidv7(),
  tome_id         uuid not null references tomes(id) on delete cascade,

  -- Alpha permits one level of list nesting. The column ships now because
  -- adding it later means migrating every block row in every Tome and
  -- rewriting every document query.
  parent_block_id uuid references blocks(id) on delete cascade,

  type            text  not null,
  content         jsonb not null default '{}'::jsonb,
  is_secret       boolean not null default false,

  -- Fractional index, base62 text. NOT a float: floats run out of precision
  -- after ~50 insertions between the same two positions and ordering then
  -- breaks silently. Generate with the `fractional-indexing` npm package.
  sort_key        text not null,

  -- Plain text extracted from `content` by trigger, for full-text search.
  search_text     text,

  -- Block locking. See Tomes Technical Document section 10.
  locked_by       uuid references auth.users(id),
  locked_at       timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index blocks_tome_order_idx on blocks (tome_id, sort_key);
create index blocks_parent_idx     on blocks (parent_block_id);

-- Secret blocks are a small subset and are filtered on every published read.
create index blocks_secret_idx on blocks (tome_id) where is_secret;

create index blocks_search_idx on blocks
  using gin (to_tsvector('english', coalesce(search_text, '')));

-- ---------------------------------------------------------------------------
-- Published blocks.
--
-- Readers never touch the draft table. Publishing copies rows across, keeping
-- the same id, so block deep links survive publication and draft-vs-published
-- diffing is the same id matching the save path already does.
--
-- No foreign key to blocks(id): a published row must survive its draft being
-- deleted, since the published version stays live until explicitly unpublished.
-- ---------------------------------------------------------------------------
create table published_blocks (
  id              uuid primary key,
  tome_id         uuid not null references tomes(id) on delete cascade,
  parent_block_id uuid,
  type            text  not null,
  content         jsonb not null,
  is_secret       boolean not null default false,
  sort_key        text not null,
  search_text     text,
  published_at    timestamptz not null default now()
);

create index published_blocks_tome_order_idx
  on published_blocks (tome_id, sort_key);

create index published_blocks_search_idx on published_blocks
  using gin (to_tsvector('english', coalesce(search_text, '')));