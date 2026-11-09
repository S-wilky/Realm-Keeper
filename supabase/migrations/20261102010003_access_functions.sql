-- 20261101120800_access_functions.sql
--
-- Role logic, written once and called from every policy. Policies that inline
-- this logic drift apart from each other, and that drift is how leaks happen.
--
-- These are the ONLY functions in the project marked `security definer`.
-- They need it to read world_members from inside a policy on another table.
-- `set search_path` is not optional on a security definer function: omitting
-- it is a known privilege-escalation vector.
--
-- Any future function marked security definer bypasses every policy in
-- migration 20261101120900 and needs a reviewer and a test.

create or replace function rk_world_role(p_world_id uuid)
returns world_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from world_members
  where world_id = p_world_id
    and user_id = auth.uid()
$$;

create or replace function rk_can_edit_tome(p_tome_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from tomes t
    where t.id = p_tome_id
      and t.archived_at is null
      and (
        rk_world_role(t.world_id) in ('owner', 'co_builder', 'contributor')
        or exists (
          select 1
          from tome_access_grants g
          where g.tome_id = t.id
            and g.user_id = auth.uid()
            and g.can_edit
        )
      )
  )
$$;

-- Anyone who can edit a Tome sees its secrets. Players, per-Tome grantees
-- without edit rights, and anonymous readers never do.
create or replace function rk_can_see_secrets(p_tome_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from tomes t
    where t.id = p_tome_id
      and rk_world_role(t.world_id) in ('owner', 'co_builder', 'contributor')
  )
$$;

-- The visibility ceiling: a Tome's effective visibility is the more
-- restrictive of its own setting and its World's -- unless the Owner has
-- switched the ceiling off (worlds.ceiling_enabled).
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
          t.status = 'finished'
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