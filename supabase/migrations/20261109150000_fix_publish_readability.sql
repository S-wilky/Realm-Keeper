-- 20261109150000_fix_publish_readability.sql
--
-- Reconnects publishing to readability.
--
-- `tome_status` was renamed from ('draft','published') to ('draft','finished'),
-- and rk_publish_tome no longer sets it. That left rk_can_read_tome gating
-- non-editor access on `status = 'finished'` while nothing set that value --
-- so publishing a Tome copied rows into published_blocks, stamped
-- published_at, and still showed players nothing.
--
-- The model after this migration:
--
--   status        author-facing content maturity. The writer marks a Tome
--                 'finished' when they consider the writing done. Purely
--                 informational -- it gates nothing.
--
--   published_at  whether a published copy exists. Set by rk_publish_tome,
--                 cleared by rk_unpublish_tome. This is what readability
--                 depends on.
--
-- A work-in-progress Tome can therefore be published for players to read,
-- and marking a Tome finished does not expose it.

create or replace function rk_can_read_tome(p_tome_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from tomes t
    join worlds w on w.id = t.world_id
    where t.id = p_tome_id
      and t.archived_at is null
      and w.archived_at is null
      and (
        rk_can_edit_tome(t.id)
        or (
          -- Published, not "finished".
          t.published_at is not null
          and (
            (t.visibility = 'public'
              and (w.visibility = 'public' or not w.ceiling_enabled))
            or (t.visibility in ('unlisted', 'public')
              and rk_world_role(t.world_id) is not null)
            or exists (
              select 1
              from tome_access_grants g
              where g.tome_id = t.id
                and g.user_id = auth.uid()
            )
          )
        )
      )
  )
$$;

-- Unpublishing removes the published copy. It does not revise the author's
-- judgement that the writing is finished, so it no longer touches status.
create or replace function rk_unpublish_tome(p_tome_id uuid)
returns void
language plpgsql
as $$
begin
  if not rk_can_edit_tome(p_tome_id) then
    raise exception 'not permitted';
  end if;

  delete from published_blocks      where tome_id = p_tome_id;
  delete from published_connections where from_tome_id = p_tome_id;

  update tomes
     set published_at = null,
         published_by = null
   where id = p_tome_id;
end;
$$;
