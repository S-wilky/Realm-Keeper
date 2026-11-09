-- 20261101120900_rls_policies.sql
--
-- Row Level Security for every table. Nothing in this project is readable or
-- writable except through these policies.
--
-- The rule they enforce: a viewer who is not entitled to content must never
-- RECEIVE it -- not receive-and-hide. Anyone can open devtools and read the
-- network tab.

alter table worlds                enable row level security;
alter table world_members         enable row level security;
alter table world_tags            enable row level security;
alter table tone_tags             enable row level security;
alter table folders               enable row level security;
alter table tomes                 enable row level security;
alter table tome_aliases          enable row level security;
alter table tome_tags             enable row level security;
alter table blocks                enable row level security;
alter table published_blocks      enable row level security;
alter table tome_connections      enable row level security;
alter table published_connections enable row level security;
alter table tome_links            enable row level security;
alter table tome_access_grants    enable row level security;
alter table tome_versions         enable row level security;
alter table tome_version_deltas   enable row level security;
alter table autolink_ignores      enable row level security;

-- ---------------------------------------------------------------------------
-- Worlds
--
-- No recursion risk here: rk_world_role is security definer, so it reads
-- world_members without triggering that table's own policy.
-- ---------------------------------------------------------------------------
create policy worlds_read on worlds
  for select using (
    archived_at is null
    and (visibility = 'public' or rk_world_role(id) is not null)
  );

create policy worlds_insert on worlds
  for insert with check (owner_id = auth.uid());

create policy worlds_update on worlds
  for update using (rk_world_role(id) = 'owner')
  with check (rk_world_role(id) = 'owner');

create policy worlds_delete on worlds
  for delete using (rk_world_role(id) = 'owner');

create policy world_members_read on world_members
  for select using (
    user_id = auth.uid() or rk_world_role(world_id) is not null
  );

-- Owner-only for now. Planning doc v6 allows delegating contributor
-- management to a Trusted Builder; that lands with the Worlds document.
create policy world_members_write on world_members
  for all using (rk_world_role(world_id) = 'owner')
  with check (rk_world_role(world_id) = 'owner');

create policy world_tags_read on world_tags
  for select using (
    exists (select 1 from worlds w
             where w.id = world_id
               and (w.visibility = 'public' or rk_world_role(w.id) is not null))
  );

create policy world_tags_write on world_tags
  for all using (rk_world_role(world_id) in ('owner', 'co_builder'))
  with check (rk_world_role(world_id) in ('owner', 'co_builder'));

-- Reference data. Readable by everyone, writable by no one through the API.
create policy tone_tags_read on tone_tags for select using (true);

create policy folders_read on folders
  for select using (
    exists (select 1 from worlds w
             where w.id = world_id
               and (w.visibility = 'public' or rk_world_role(w.id) is not null))
  );

create policy folders_write on folders
  for all using (rk_world_role(world_id) in ('owner', 'co_builder', 'contributor'))
  with check (rk_world_role(world_id) in ('owner', 'co_builder', 'contributor'));

-- ---------------------------------------------------------------------------
-- Tomes
-- ---------------------------------------------------------------------------
create policy tomes_read on tomes
  for select using (rk_can_read_tome(id));

create policy tomes_write on tomes
  for all using (rk_can_edit_tome(id))
  with check (rk_can_edit_tome(id));

create policy tome_aliases_read on tome_aliases
  for select using (rk_can_read_tome(tome_id));

create policy tome_aliases_write on tome_aliases
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

create policy tome_tags_read on tome_tags
  for select using (rk_can_read_tome(tome_id));

create policy tome_tags_write on tome_tags
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

-- ---------------------------------------------------------------------------
-- Blocks
--
-- Draft content is editors only. All visibility-ceiling logic lives on the
-- published side, which reduces this to a single question and is why the
-- draft policy is one function call.
-- ---------------------------------------------------------------------------
create policy blocks_read on blocks
  for select using (rk_can_edit_tome(tome_id));

create policy blocks_write on blocks
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

-- THE IMPORTANT ONE. A reader who cannot see secrets never receives secret
-- rows -- filtered by Postgres before anything leaves the database.
--
-- When container blocks ship, extend this with a recursive CTE walking
-- parent_block_id, so a secret block nested inside a visible parent is also
-- filtered. A non-secret block can contain secret children.
create policy published_blocks_read on published_blocks
  for select using (
    rk_can_read_tome(tome_id)
    and (not is_secret or rk_can_see_secrets(tome_id))
  );

-- Published rows are written only by the publish RPC, never by clients.
create policy published_blocks_write on published_blocks
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

-- ---------------------------------------------------------------------------
-- Connections and links
-- ---------------------------------------------------------------------------
create policy connections_read on tome_connections
  for select using (rk_can_edit_tome(from_tome_id));

create policy connections_write on tome_connections
  for all using (rk_can_edit_tome(from_tome_id))
  with check (rk_can_edit_tome(from_tome_id));

create policy published_connections_read on published_connections
  for select using (
    rk_can_read_tome(from_tome_id)
    and (not is_secret or rk_can_see_secrets(from_tome_id))
  );

create policy published_connections_write on published_connections
  for all using (rk_can_edit_tome(from_tome_id))
  with check (rk_can_edit_tome(from_tome_id));

-- Maintained by trigger, read for deletion warnings.
create policy tome_links_read on tome_links
  for select using (rk_can_read_tome(from_tome_id));

-- ---------------------------------------------------------------------------
-- Grants, versions, autolink ignores
-- ---------------------------------------------------------------------------
create policy grants_read on tome_access_grants
  for select using (
    user_id = auth.uid() or rk_can_edit_tome(tome_id)
  );

create policy grants_write on tome_access_grants
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

create policy versions_read on tome_versions
  for select using (rk_can_edit_tome(tome_id));

create policy versions_write on tome_versions
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));

create policy deltas_read on tome_version_deltas
  for select using (
    exists (select 1 from tome_versions v
             where v.id = version_id and rk_can_edit_tome(v.tome_id))
  );

create policy deltas_write on tome_version_deltas
  for all using (
    exists (select 1 from tome_versions v
             where v.id = version_id and rk_can_edit_tome(v.tome_id))
  )
  with check (
    exists (select 1 from tome_versions v
             where v.id = version_id and rk_can_edit_tome(v.tome_id))
  );

create policy autolink_ignores_all on autolink_ignores
  for all using (rk_can_edit_tome(tome_id))
  with check (rk_can_edit_tome(tome_id));