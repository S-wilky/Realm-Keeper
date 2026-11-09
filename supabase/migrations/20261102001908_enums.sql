-- 20261101120200_enums.sql
-- All enum types in one place. world_role is used by both the Worlds tables
-- and the Tomes access functions, so the dependency crosses document
-- boundaries and needs one obvious home.
--
-- Adding a value later: `alter type <name> add value '<new>'`. Note that in
-- Postgres this cannot run inside a transaction block alongside statements
-- that use the new value, so give it its own migration.

create type world_role       as enum ('owner', 'co_builder', 'contributor', 'player');
create type world_visibility as enum ('private', 'unlisted', 'public');
create type world_status     as enum ('active', 'complete', 'on_hiatus', 'archived');
create type content_rating   as enum ('general', 'teen', 'mature');
create type world_tag_kind   as enum ('genre', 'tone', 'system', 'custom');

create type tome_status     as enum ('draft', 'finished');
create type tome_visibility as enum ('private', 'unlisted', 'public');