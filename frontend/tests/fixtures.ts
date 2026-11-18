// tests/fixtures.ts
//
// Test data. Every role, every visibility state, both sides of the
// draft/published divide.
//
// This is TypeScript rather than supabase/seed.sql because the fixtures need
// auth users (painful to insert by hand, and the required columns change
// between Supabase versions) and because each test file wants its own
// isolated World. seed.sql runs once after `db reset`; this runs per suite.
//
// CHANGED 2026-11-17
//   1. makeTome no longer sets archived_at on INSERT, and no longer publishes.
//      Both are now deferred to passes at the bottom of seedWorlds().
//   2. Added a `pending` array so those passes know what to publish/archive.
//   3. Publish pass runs AFTER connections are inserted (rk_publish_tome
//      snapshots connections too, so publishing first produced an empty
//      published_connections).
//   4. Archive pass runs last (rk_can_edit_tome refuses an archived Tome, so
//      publishing has to come first).
//   5. Returned Tome rows are re-read from the database at the end, so
//      published_at / archived_at are accurate on the fixture object.

import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL!;
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY!;
const SECRET = process.env.SUPABASE_SECRET_KEY!;

/**
 * Bypasses RLS entirely. Use ONLY to build fixtures and to simulate the
 * passage of time. Never assert against it -- an assertion made with this
 * client proves nothing about policies.
 */
export const admin = createClient(URL, SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** A signed-out client. auth.uid() is null. */
export const anonClient = (): SupabaseClient =>
  createClient(URL, PUBLISHABLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

const PASSWORD = 'test-password';
const clientCache = new Map<string, SupabaseClient>();

export async function createUser(email: string): Promise<User> {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw new Error(`createUser(${email}): ${error.message}`);
  return data.user!;
}

/** A client carrying a real signed-in session, so auth.uid() is set. */
export async function clientAs(email: string): Promise<SupabaseClient> {
  const cached = clientCache.get(email);
  if (cached) return cached;

  const client = anonClient();
  const { error } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error) throw new Error(`clientAs(${email}): ${error.message}`);

  clientCache.set(email, client);
  return client;
}

// ---------------------------------------------------------------------------

const para = (text: string) => ({
  doc: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

/** A paragraph containing an inline link to another Tome. */
const paraWithLink = (text: string, toTomeId: string) => ({
  doc: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text,
          marks: [{ type: 'tomeLink', attrs: { tomeId: toTomeId } }],
        },
      ],
    },
  ],
});

type TomeSpec = {
  key: string;
  title: string;
  visibility: 'private' | 'unlisted' | 'public';
  status?: 'draft' | 'finished';
  publish?: boolean;
  archived?: boolean;
};

export type Fixture = Awaited<ReturnType<typeof seedWorlds>>;

/**
 * Builds the full matrix.
 *
 * `label` must be unique per test file: emails are globally unique in auth,
 * and Tome titles are unique per World. Separate labels mean separate Worlds
 * and separate users, so test files never collide even though they share one
 * database.
 */
export async function seedWorlds(label: string) {
  // -- users ---------------------------------------------------------------
  const owner       = await createUser(`owner-${label}@test.local`);
  const coBuilder   = await createUser(`cobuilder-${label}@test.local`);
  const contributor = await createUser(`contributor-${label}@test.local`);
  const player      = await createUser(`player-${label}@test.local`);
  const outsider    = await createUser(`outsider-${label}@test.local`);
  const grantedRead = await createUser(`grantread-${label}@test.local`);
  const grantedEdit = await createUser(`grantedit-${label}@test.local`);

  // -- worlds --------------------------------------------------------------
  const makeWorld = async (
    name: string,
    visibility: 'private' | 'unlisted' | 'public',
    ceilingEnabled = true,
  ) => {
    const { data, error } = await admin
      .from('worlds')
      .insert({
        name: `${name} ${label}`,
        owner_id: owner.id,
        visibility,
        ceiling_enabled: ceilingEnabled,
      })
      .select()
      .single();
    if (error) throw new Error(`makeWorld(${name}): ${error.message}`);
    return data;
  };

  const privateWorld = await makeWorld('Private World', 'private');
  const publicWorld  = await makeWorld('Public World', 'public');
  // Private World, ceiling switched off: a public Tome inside it is readable
  // by anyone even though the World itself is private.
  const openWorld    = await makeWorld('Ceiling Off World', 'private', false);

  // The owner's membership row is created by trigger. Add everyone else.
  for (const world of [privateWorld, publicWorld, openWorld]) {
    const { error } = await admin.from('world_members').insert([
      { world_id: world.id, user_id: coBuilder.id,   role: 'co_builder' },
      { world_id: world.id, user_id: contributor.id, role: 'contributor' },
      { world_id: world.id, user_id: player.id,      role: 'player' },
    ]);
    if (error) throw new Error(`world_members: ${error.message}`);
  }

  // -- tomes ---------------------------------------------------------------
  const ownerClient = await clientAs(owner.email!);

  // Tomes are created first, then connections, then published. Collected here
  // so the publish and archive passes further down can run in that order.
  const pending: { spec: TomeSpec; id: string }[] = [];

  const makeTome = async (worldId: string, spec: TomeSpec) => {
    const { data: tome, error } = await admin
      .from('tomes')
      .insert({
        world_id: worldId,
        type: 'location',
        title: `${spec.title} ${label}`,
        visibility: spec.visibility,
        status: spec.status ?? 'draft',
        created_by: owner.id,
      })
      .select()
      .single();
    if (error) throw new Error(`makeTome(${spec.key}): ${error.message}`);

    const { data: blocks, error: blockError } = await admin
      .from('blocks')
      .insert([
        {
          tome_id: tome.id, type: 'paragraph', sort_key: 'a0',
          is_secret: false, content: para('The hollow burned in spring.'),
        },
        {
          tome_id: tome.id, type: 'paragraph', sort_key: 'a1',
          is_secret: true,  content: para('Their oath is a forgery.'),
        },
      ])
      .select();
    if (blockError) throw new Error(`blocks(${spec.key}): ${blockError.message}`);

    pending.push({ spec, id: tome.id });

    return {
      ...tome,
      publicBlock: blocks![0],
      secretBlock: blocks![1],
    };
  };

  const draftPrivate = await makeTome(privateWorld.id, {
    key: 'draftPrivate', title: 'Draft Private', visibility: 'private',
  });

  const pubPrivate = await makeTome(privateWorld.id, {
    key: 'pubPrivate', title: 'Published Private',
    visibility: 'private', publish: true,
  });

  const pubUnlisted = await makeTome(privateWorld.id, {
    key: 'pubUnlisted', title: 'Published Unlisted',
    visibility: 'unlisted', publish: true,
  });

  const pubPublicInPrivateWorld = await makeTome(privateWorld.id, {
    key: 'pubPublicInPrivateWorld', title: 'Published Public Ceilinged',
    visibility: 'public', publish: true,
  });

  const archived = await makeTome(privateWorld.id, {
    key: 'archived', title: 'Archived', visibility: 'public',
    publish: true, archived: true,
  });

  const finishedUnpublished = await makeTome(privateWorld.id, {
    key: 'finishedUnpublished', title: 'Finished But Unpublished',
    visibility: 'public', status: 'finished',
  });

  const pubPublicInPublicWorld = await makeTome(publicWorld.id, {
    key: 'pubPublicInPublicWorld', title: 'Published Public Open',
    visibility: 'public', publish: true,
  });

  const pubPublicCeilingOff = await makeTome(openWorld.id, {
    key: 'pubPublicCeilingOff', title: 'Published Public Ceiling Off',
    visibility: 'public', publish: true,
  });

  // -- grants --------------------------------------------------------------
  const { error: grantError } = await admin.from('tome_access_grants').insert([
    { tome_id: pubPrivate.id,   user_id: grantedRead.id, can_edit: false },
    { tome_id: draftPrivate.id, user_id: grantedEdit.id, can_edit: true },
  ]);
  if (grantError) throw new Error(`grants: ${grantError.message}`);

  // -- connections ---------------------------------------------------------
  const { error: connError } = await admin.from('tome_connections').insert([
    {
      world_id: privateWorld.id,
      from_tome_id: pubUnlisted.id,
      to_tome_id: pubPrivate.id,
      relationship_type: 'located in',
      is_secret: false,
    },
    {
      world_id: privateWorld.id,
      from_tome_id: pubUnlisted.id,
      to_tome_id: draftPrivate.id,
      relationship_type: 'secretly funds',
      is_secret: true,
    },
  ]);
  if (connError) throw new Error(`connections: ${connError.message}`);

  // -- publish -------------------------------------------------------------
  // After connections, not inside makeTome: rk_publish_tome snapshots
  // connections as well as blocks, so anything connected afterwards is
  // missing from the published copy.
  for (const { spec, id } of pending) {
    if (!spec.publish) continue;
    const { error } = await ownerClient.rpc('rk_publish_tome', { p_tome_id: id });
    if (error) throw new Error(`publish(${spec.key}): ${error.message}`);
  }

  // -- archive -------------------------------------------------------------
  // Last. rk_can_edit_tome refuses an archived Tome, so one that is archived
  // can never be published afterwards -- which is also the only order the
  // product allows: publish, then later archive.
  for (const { spec, id } of pending) {
    if (!spec.archived) continue;
    const { error } = await admin
      .from('tomes')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(`archive(${spec.key}): ${error.message}`);
  }

  // The rows above were read before publishing and archiving, so re-read them
  // to keep published_at / archived_at honest for assertions.
  const built = [
    draftPrivate, pubPrivate, pubUnlisted, pubPublicInPrivateWorld,
    pubPublicInPublicWorld, pubPublicCeilingOff, archived, finishedUnpublished,
  ];
  const { data: fresh, error: freshError } = await admin
    .from('tomes').select('*').in('id', built.map((t) => t.id));
  if (freshError) throw new Error(`refresh: ${freshError.message}`);

  const merge = <T extends { id: string }>(t: T): T => {
    const row = fresh!.find((r: { id: string }) => r.id === t.id);
    return { ...t, ...row } as T;
  };

  return {
    label,
    users: { owner, coBuilder, contributor, player, outsider, grantedRead, grantedEdit },
    worlds: { privateWorld, publicWorld, openWorld },
    tomes: {
      draftPrivate:            merge(draftPrivate),
      pubPrivate:              merge(pubPrivate),
      pubUnlisted:             merge(pubUnlisted),
      pubPublicInPrivateWorld: merge(pubPublicInPrivateWorld),
      pubPublicInPublicWorld:  merge(pubPublicInPublicWorld),
      pubPublicCeilingOff:     merge(pubPublicCeilingOff),
      archived:                merge(archived),
      finishedUnpublished:     merge(finishedUnpublished),
    },
    helpers: { para, paraWithLink },
  };
}
