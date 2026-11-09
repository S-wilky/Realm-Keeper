-- 20261101120300_worlds.sql
--
-- PROVISIONAL. These tables belong to the Worlds section and will be
-- superseded when the Worlds technical document is written. They exist now
-- because every Tomes access function reads them and no policy test can run
-- without them. Metadata fields follow Planning Document v6.

create table worlds (
  id                uuid primary key default uuidv7(),
  owner_id          uuid not null references auth.users(id),
  name              text not null,
  description       text,
  cover_image_path  text,
  visibility        world_visibility not null default 'private',
  status            world_status     not null default 'active',
  rating            content_rating   not null default 'general',
  era               text,
  inspirations      text,
  languages         text[] not null default '{}',

  -- Planning doc v6: the World visibility ceiling can be switched off by the
  -- Owner who wants individual Tomes public before the World homepage is
  -- ready. rk_can_read_tome honours this.
  ceiling_enabled   boolean not null default true,

  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index worlds_owner_idx on worlds (owner_id) where archived_at is null;

create table world_members (
  world_id        uuid not null references worlds(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            world_role not null,

  -- Planning doc v6: Trusted Builder is a per-co-builder toggle, not a
  -- separate role. Grants contributor management. Enforced in the
  -- application layer for now.
  trusted_builder boolean not null default false,

  created_at      timestamptz not null default now(),
  primary key (world_id, user_id)
);

create index world_members_user_idx on world_members (user_id);

-- Creating a World must also make the creator a member, or the row becomes
-- invisible to its own owner the moment RLS is on.
create or replace function rk_world_add_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into world_members (world_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

create trigger worlds_add_owner
  after insert on worlds
  for each row execute function rk_world_add_owner();

-- ---------------------------------------------------------------------------
-- Tags.
--
-- Planning doc v6 has four kinds with different rules: genre, system and
-- custom are freeform; tone comes from a fixed list that grows from community
-- feedback. One table with a `kind` column rather than four tables, with a
-- lookup table constraining tone only. A lookup table rather than an enum
-- because adding a tone value should be an INSERT, not a migration.
-- ---------------------------------------------------------------------------
create table tone_tags (
  tag        text primary key,
  label      text not null,
  sort_order int  not null default 0
);

insert into tone_tags (tag, label, sort_order) values
  ('family_friendly', 'Family Friendly', 10),
  ('lighthearted',    'Lighthearted',    20),
  ('neutral',         'Neutral',         30),
  ('dark_themes',     'Dark Themes',     40),
  ('gritty',          'Gritty',          50),
  ('horror',          'Horror',          60),
  ('comedic',         'Comedic',         70),
  ('romantic',        'Romantic',        80);

create table world_tags (
  world_id uuid           not null references worlds(id) on delete cascade,
  kind     world_tag_kind not null,
  tag      text           not null,
  primary key (world_id, kind, tag)
);

create index world_tags_lookup_idx on world_tags (kind, tag);

create or replace function rk_world_tag_guard()
returns trigger
language plpgsql
as $$
begin
  if new.kind = 'tone'
     and not exists (select 1 from tone_tags where tag = new.tag) then
    raise exception 'unknown tone tag: %', new.tag;
  end if;
  return new;
end;
$$;

create trigger world_tags_guard
  before insert or update on world_tags
  for each row execute function rk_world_tag_guard();

-- ---------------------------------------------------------------------------
-- Folders. Nesting supported; same fractional ordering as blocks so that
-- reordering a folder updates one row.
-- ---------------------------------------------------------------------------
create table folders (
  id               uuid primary key default uuidv7(),
  world_id         uuid not null references worlds(id) on delete cascade,
  parent_folder_id uuid references folders(id) on delete cascade,
  name             text not null,
  sort_key         text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index folders_world_idx  on folders (world_id);
create index folders_parent_idx on folders (parent_folder_id);