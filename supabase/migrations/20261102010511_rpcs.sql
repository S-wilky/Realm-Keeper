-- 20261101121100_rpcs.sql
--
-- The functions the editor calls. All are `security invoker` (the default) --
-- RLS applies inside them, so a user who cannot write a Tome affects zero
-- rows rather than succeeding silently. Do not add `security definer` to
-- anything here.

-- ---------------------------------------------------------------------------
-- Acquire a block lock.
--
-- Postgres resolves the race: the conditional UPDATE either matches a row or
-- it does not. No application-level coordination.
-- ---------------------------------------------------------------------------
create or replace function rk_acquire_lock(p_block_id uuid)
returns jsonb
language plpgsql
as $$
declare
  v_locked_by uuid;
  v_locked_at timestamptz;
begin
  update blocks
     set locked_by = auth.uid(),
         locked_at = now()
   where id = p_block_id
     and (locked_by is null
          or locked_by = auth.uid()
          or locked_at < now() - interval '2 minutes');

  if found then
    return jsonb_build_object('acquired', true);
  end if;

  select locked_by, locked_at
    into v_locked_by, v_locked_at
  from blocks
  where id = p_block_id;

  if not found then
    -- Either the block does not exist or the caller cannot see it. Do not
    -- distinguish: that would confirm the existence of a block in a Tome
    -- the caller has no access to.
    return jsonb_build_object('acquired', false, 'reason', 'unavailable');
  end if;

  return jsonb_build_object(
    'acquired',   false,
    'reason',     'held',
    'held_by',    v_locked_by,
    'held_until', v_locked_at + interval '2 minutes');
end;
$$;

-- Refreshes an existing lock. Called on a 30-second heartbeat while a block
-- has focus. Returns false if the lock was lost, so the client can go
-- read-only and offer to copy the user's text.
create or replace function rk_heartbeat_lock(p_block_id uuid)
returns boolean
language plpgsql
as $$
begin
  update blocks
     set locked_at = now()
   where id = p_block_id
     and locked_by = auth.uid();
  return found;
end;
$$;

create or replace function rk_release_lock(p_block_id uuid)
returns void
language sql
as $$
  update blocks
     set locked_by = null,
         locked_at = null
   where id = p_block_id
     and locked_by = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Batched block write.
--
-- One transaction for a whole save. A paste can produce fifty inserts;
-- fifty round trips and a partial-write failure mode are both avoidable.
--
-- Expected shape of p_ops:
--   [
--     {"op":"insert","block":{"id":"...","type":"paragraph",
--                             "content":{...},"is_secret":false,
--                             "sort_key":"a0","parent_block_id":null}},
--     {"op":"update","id":"...","content":{...},"is_secret":true},
--     {"op":"move",  "id":"...","sort_key":"a1"},
--     {"op":"delete","id":"..."}
--   ]
-- ---------------------------------------------------------------------------
create or replace function rk_save_blocks(p_tome_id uuid, p_ops jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_op     jsonb;
  v_id     uuid;
  v_locked jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(p_ops) <> 'array' then
    raise exception 'p_ops must be a json array';
  end if;

  if jsonb_array_length(p_ops) = 0 then
    return jsonb_build_object('saved_at', now());
  end if;

  -- Pass 1: refuse the whole batch if any target block is held by another
  -- user. Checked up front so a large paste cannot half-apply and then roll
  -- back -- the caller gets a usable list of what blocked it.
  for v_op in select * from jsonb_array_elements(p_ops) loop
    if v_op->>'op' in ('update', 'move', 'delete') then
      v_id := (v_op->>'id')::uuid;
      if exists (
        select 1
        from blocks b
        where b.id = v_id
          and b.tome_id = p_tome_id
          and b.locked_by is not null
          and b.locked_by <> auth.uid()
          and b.locked_at > now() - interval '2 minutes'
      ) then
        v_locked := v_locked || jsonb_build_object('id', v_id);
      end if;
    end if;
  end loop;

  if jsonb_array_length(v_locked) > 0 then
    return jsonb_build_object('locked', v_locked);
  end if;

  -- Pass 2: apply.
  for v_op in select * from jsonb_array_elements(p_ops) loop
    case v_op->>'op'

      when 'insert' then
        insert into blocks (
          id, tome_id, parent_block_id, type, content, is_secret, sort_key)
        values (
          coalesce(nullif(v_op->'block'->>'id', '')::uuid, uuidv7()),
          p_tome_id,
          nullif(v_op->'block'->>'parent_block_id', '')::uuid,
          v_op->'block'->>'type',
          coalesce(v_op->'block'->'content', '{}'::jsonb),
          coalesce((v_op->'block'->>'is_secret')::boolean, false),
          v_op->'block'->>'sort_key')
        on conflict (id) do nothing;

      when 'update' then
        update blocks
           set content   = coalesce(v_op->'content', content),
               is_secret = coalesce((v_op->>'is_secret')::boolean, is_secret),
               sort_key  = coalesce(v_op->>'sort_key', sort_key)
         where id = (v_op->>'id')::uuid
           and tome_id = p_tome_id;

      when 'move' then
        update blocks
           set sort_key = v_op->>'sort_key'
         where id = (v_op->>'id')::uuid
           and tome_id = p_tome_id;

      when 'delete' then
        delete from blocks
         where id = (v_op->>'id')::uuid
           and tome_id = p_tome_id;

      else
        raise exception 'unknown op: %', v_op->>'op';
    end case;
  end loop;

  update tomes set updated_at = now() where id = p_tome_id;

  return jsonb_build_object('saved_at', now());
end;
$$;

-- ---------------------------------------------------------------------------
-- Publish.
--
-- Replace-all rather than incremental. A 500-row delete-and-insert in one
-- transaction is fast, and an incremental version can come later if it ever
-- matters. Connections diverge with content, so they are republished too.
-- ---------------------------------------------------------------------------
create or replace function rk_publish_tome(p_tome_id uuid)
returns jsonb
language plpgsql
as $$
declare
  v_snapshot jsonb;
  v_version  uuid;
begin
  if not rk_can_edit_tome(p_tome_id) then
    raise exception 'not permitted';
  end if;

  delete from published_blocks      where tome_id = p_tome_id;
  delete from published_connections where from_tome_id = p_tome_id;

  insert into published_blocks (
    id, tome_id, parent_block_id, type, content, is_secret, sort_key)
  select id, tome_id, parent_block_id, type, content, is_secret, sort_key
  from blocks
  where tome_id = p_tome_id;

  insert into published_connections (
    id, world_id, from_tome_id, to_tome_id,
    relationship_type, is_mutual, is_secret)
  select id, world_id, from_tome_id, to_tome_id,
         relationship_type, is_mutual, is_secret
  from tome_connections
  where from_tome_id = p_tome_id;

  -- Every publish stores a full snapshot. Publishing needs a complete
  -- content state anyway, and these are exempt from the 30-day retention job.
  select jsonb_agg(to_jsonb(b) order by b.sort_key)
    into v_snapshot
  from blocks b
  where b.tome_id = p_tome_id;

  insert into tome_versions (tome_id, created_by, snapshot, is_publish)
  values (p_tome_id, auth.uid(), coalesce(v_snapshot, '[]'::jsonb), true)
  returning id into v_version;

  update tomes
     set
         published_at = now(),
         published_by = auth.uid()
   where id = p_tome_id;

  return jsonb_build_object('published_at', now(), 'version_id', v_version);
end;
$$;

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
     set status       = 'draft',
         published_at = null,
         published_by = null
   where id = p_tome_id;
end;
$$;