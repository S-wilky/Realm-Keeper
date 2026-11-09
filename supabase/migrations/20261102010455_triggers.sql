-- 20261101121000_triggers.sql
-- Derived data and guards. Everything here keeps a column or table in sync
-- that the application would otherwise have to remember to maintain.

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create trigger worlds_updated_at
  before update on worlds
  for each row execute function set_updated_at();

create trigger folders_updated_at
  before update on folders
  for each row execute function set_updated_at();

create trigger tomes_updated_at
  before update on tomes
  for each row execute function set_updated_at();

create trigger blocks_updated_at
  before update on blocks
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Lock guard.
--
-- blocks_write lets any editor of a Tome write any of its block rows,
-- including the lock columns. Without this, an editor could set locked_by to
-- another user's id and freeze a block for everyone for two minutes.
--
-- Only fires when the lock is actually being taken or changed, so ordinary
-- content writes that leave locked_by alone pass through untouched. Taking
-- over an EXPIRED lock still works: the acquire sets locked_by to your own
-- id, which satisfies the guard.
-- ---------------------------------------------------------------------------
create or replace function rk_blocks_lock_guard()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.locked_by is not null and new.locked_by <> auth.uid() then
      raise exception 'locked_by must be the current user';
    end if;
  elsif new.locked_by is distinct from old.locked_by
        and new.locked_by is not null
        and new.locked_by <> auth.uid() then
    raise exception 'locked_by must be the current user';
  end if;
  return new;
end;
$$;

create trigger blocks_lock_guard
  before insert or update on blocks
  for each row execute function rk_blocks_lock_guard();

-- ---------------------------------------------------------------------------
-- search_text.
--
-- Derived from content rather than maintained by the application, so an
-- import, a version restore and an ordinary save all produce the same index.
-- ---------------------------------------------------------------------------
create or replace function rk_blocks_derive_search()
returns trigger
language plpgsql
as $$
begin
  new.search_text := rk_extract_text(new.content);
  return new;
end;
$$;

create trigger blocks_derive_search
  before insert or update of content on blocks
  for each row execute function rk_blocks_derive_search();

create trigger published_blocks_derive_search
  before insert or update of content on published_blocks
  for each row execute function rk_blocks_derive_search();

-- ---------------------------------------------------------------------------
-- tome_links.
--
-- Mirrors inline link marks out of block JSON into a queryable table.
-- Links pointing at a Tome that no longer exists are skipped rather than
-- erroring -- the mark stays in the content and renders as a broken link.
-- ---------------------------------------------------------------------------
create or replace function rk_blocks_sync_links()
returns trigger
language plpgsql
as $$
declare
  v_ids uuid[];
begin
  delete from tome_links where from_block_id = new.id;

  v_ids := rk_extract_link_ids(new.content);

  if array_length(v_ids, 1) > 0 then
    insert into tome_links (from_tome_id, from_block_id, to_tome_id)
    select new.tome_id, new.id, x
    from unnest(v_ids) as x
    where exists (select 1 from tomes t where t.id = x)
      and x <> new.tome_id
    on conflict do nothing;
  end if;

  return null;
end;
$$;

create trigger blocks_sync_links
  after insert or update of content on blocks
  for each row execute function rk_blocks_sync_links();