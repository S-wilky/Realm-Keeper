-- ---------------------------------------------------------------------------
-- 20261117200000_fix_insert_policies.sql
--
-- WHAT CHANGED AND WHY
--
-- 1. tomes: replaced the single `tomes_write` FOR ALL policy with separate
--    INSERT / UPDATE / DELETE policies.
--
--    `tomes_write` used rk_can_edit_tome(id) as its WITH CHECK. That function
--    looks the Tome up by id in `tomes`, and during an INSERT the new row is
--    not yet visible to it, so it always returned false and every
--    user-initiated INSERT was rejected with 42501. The new INSERT policy
--    tests the World role off the NEW row's world_id instead, which IS
--    available. UPDATE and DELETE keep rk_can_edit_tome(id) -- by then the
--    row exists.
--
--    A per-Tome access grant cannot authorise creating a *new* Tome (a grant
--    names a Tome that already exists), so World role is the whole test.
--
--    SELECT is unaffected: `tomes_read` already covers it via
--    rk_can_read_tome(id), which ORs in rk_can_edit_tome(id).
--
-- 2. worlds: `worlds_read` now also matches owner_id = auth.uid().
--
--    `worlds_add_owner` is an AFTER INSERT trigger, so during
--    INSERT ... RETURNING no world_members row exists yet, rk_world_role()
--    returns null, and the SELECT policy rejected the row the creator had
--    just created. Matching on owner_id closes that gap, and also means an
--    owner never loses sight of their own World if a membership row goes
--    missing for any other reason.
--
-- NOT CHANGED
--    This does not stop a Tome being created inside an archived World --
--    rk_world_role() does not look at worlds.archived_at. Left alone
--    deliberately; it wants its own decision rather than a silent change
--    bundled into a bug fix.
-- ---------------------------------------------------------------------------

-- 1. tomes ------------------------------------------------------------------
drop policy if exists tomes_write on tomes;

create policy tomes_insert on tomes
  for insert with check (
    rk_world_role(world_id) in ('owner', 'co_builder', 'contributor')
  );

create policy tomes_update on tomes
  for update using (rk_can_edit_tome(id))
  with check (rk_can_edit_tome(id));

create policy tomes_delete on tomes
  for delete using (rk_can_edit_tome(id));

-- 2. worlds -----------------------------------------------------------------
drop policy if exists worlds_read on worlds;

create policy worlds_read on worlds
  for select using (
    archived_at is null
    and (
      owner_id = auth.uid()
      or visibility = 'public'
      or rk_world_role(id) is not null
    )
  );
