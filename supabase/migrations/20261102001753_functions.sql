-- 20261101120100_functions.sql
-- Shared helper functions. Must run first; later migrations depend on uuidv7().

-- ---------------------------------------------------------------------------
-- UUIDv7 — time-ordered UUIDs.
--
-- Postgres 18 ships uuidv7() natively. This project is on Postgres 17, and
-- the pg_uuidv7 extension is not available on Supabase, so it is defined here.
--
-- Time ordering matters: block rows are read in (tome_id, sort_key) order
-- constantly, and random v4 keys fragment the index. Verified to produce a
-- correct RFC 9562 version-7 UUID (version nibble 7, variant 8).
--
-- When Supabase moves to Postgres 18, drop this function and let the built-in
-- take over. The column defaults do not need to change.
-- ---------------------------------------------------------------------------
create or replace function uuidv7()
returns uuid
language sql
volatile
as $$
  select encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid())
          placing substring(
            int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint)
            from 3)
          from 1 for 6),
        52, 1),
      53, 1), 'hex')::uuid;
$$;

comment on function uuidv7() is
  'RFC 9562 version 7 UUID. Remove and use the built-in on Postgres 18+.';

-- ---------------------------------------------------------------------------
-- updated_at maintenance. Attached by trigger to every table with the column.
-- Without this, updated_at only ever holds its insert-time default, and the
-- unpublished-changes indicator (which compares tomes.updated_at against
-- tomes.published_at) silently never fires.
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Plain-text extraction from Tiptap node JSON, for full-text search.
--
-- 'strict' is deliberate and not interchangeable with 'lax': lax mode unwraps
-- arrays during recursive descent and returns every string twice. strict mode
-- returns an empty set rather than erroring when the path does not match, so
-- empty blocks and non-text blocks (divider, image) are handled.
-- ---------------------------------------------------------------------------
create or replace function rk_extract_text(p_content jsonb)
returns text
language sql
immutable
as $$
  select coalesce(string_agg(x #>> '{}', ' '), '')
  from jsonb_path_query(p_content, 'strict $.**.text') as x;
$$;

-- ---------------------------------------------------------------------------
-- Tome ids referenced by inline link marks in Tiptap node JSON.
-- Expects marks shaped as:
--   {"type":"tomeLink","attrs":{"tomeId":"<uuid>"}}
-- If the editor's mark name changes, change it here too.
-- ---------------------------------------------------------------------------
create or replace function rk_extract_link_ids(p_content jsonb)
returns uuid[]
language sql
immutable
as $$
  select coalesce(array_agg(distinct (x #>> '{}')::uuid), '{}'::uuid[])
  from jsonb_path_query(
         p_content,
         'strict $.**.marks[*] ? (@.type == "tomeLink").attrs.tomeId') as x;
$$;