// tests/rls/read-access.test.ts
//
// Who can read which Tome. This is the matrix from
// Access Control and Roles v2 section 5.

import { describe, it, expect, beforeAll } from 'vitest';
import { seedWorlds, clientAs, anonClient, type Fixture } from '../fixtures';

let fx: Fixture;

beforeAll(async () => {
  fx = await seedWorlds('read');
}, 60_000);

describe('members of a World', () => {
  it('lets an owner read every Tome in it, draft or published', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const { data } = await c
      .from('tomes')
      .select('id')
      .eq('world_id', fx.worlds.privateWorld.id);

    // Six Tomes in the private World, one of which is archived.
    expect(data).toHaveLength(5);
  });

  it('lets a contributor read drafts', async () => {
    const c = await clientAs(fx.users.contributor.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.draftPrivate.id);

    expect(data).toHaveLength(1);
  });

  it('hides an unpublished Tome from a player', async () => {
    const c = await clientAs(fx.users.player.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.draftPrivate.id);

    expect(data).toEqual([]);
  });

  it('shows a player a published unlisted Tome', async () => {
    const c = await clientAs(fx.users.player.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(1);
  });

  it('hides a published PRIVATE Tome from a player', async () => {
    const c = await clientAs(fx.users.player.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubPrivate.id);

    expect(data).toEqual([]);
  });
});

describe('publishing gates readability, not status', () => {
  // These two are the regression tests for the status/published_at split.
  // Before the fix migration, the first of them failed.

  it('shows a published Tome to a player even while status is draft', async () => {
    expect(fx.tomes.pubUnlisted.status).toBe('draft');

    const c = await clientAs(fx.users.player.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(1);
  });

  it('hides a finished-but-unpublished Tome from a player', async () => {
    expect(fx.tomes.finishedUnpublished.status).toBe('finished');
    expect(fx.tomes.finishedUnpublished.published_at).toBeNull();

    const c = await clientAs(fx.users.player.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.finishedUnpublished.id);

    expect(data).toEqual([]);
  });
});

describe('the World visibility ceiling', () => {
  it('hides a public Tome inside a private World from an outsider', async () => {
    const c = await clientAs(fx.users.outsider.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubPublicInPrivateWorld.id);

    expect(data).toEqual([]);
  });

  it('shows a public Tome inside a public World to anyone signed in', async () => {
    const c = await clientAs(fx.users.outsider.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubPublicInPublicWorld.id);

    expect(data).toHaveLength(1);
  });

  it('shows a public Tome to an anonymous reader', async () => {
    const { data } = await anonClient()
      .from('tomes').select('id').eq('id', fx.tomes.pubPublicInPublicWorld.id);

    expect(data).toHaveLength(1);
  });

  it('honours ceiling_enabled = false on a private World', async () => {
    const { data } = await anonClient()
      .from('tomes').select('id').eq('id', fx.tomes.pubPublicCeilingOff.id);

    expect(data).toHaveLength(1);
  });
});

describe('per-Tome grants', () => {
  it('lets a granted reader see a published private Tome', async () => {
    const c = await clientAs(fx.users.grantedRead.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.pubPrivate.id);

    expect(data).toHaveLength(1);
  });

  it('lets a granted editor see an unpublished Tome', async () => {
    const c = await clientAs(fx.users.grantedEdit.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.draftPrivate.id);

    expect(data).toHaveLength(1);
  });

  it('does not leak other Tomes to a granted reader', async () => {
    const c = await clientAs(fx.users.grantedRead.email!);
    const { data } = await c
      .from('tomes').select('id').eq('id', fx.tomes.draftPrivate.id);

    expect(data).toEqual([]);
  });
});

describe('archived content', () => {
  it('hides an archived Tome even though it was published and public', async () => {
    const { data } = await anonClient()
      .from('tomes').select('id').eq('id', fx.tomes.archived.id);

    expect(data).toEqual([]);
  });
});

describe('anonymous readers', () => {
  it('see no draft content anywhere', async () => {
    const { data } = await anonClient().from('blocks').select('id');
    expect(data).toEqual([]);
  });

  it('see no private World', async () => {
    const { data } = await anonClient()
      .from('worlds').select('id').eq('id', fx.worlds.privateWorld.id);

    expect(data).toEqual([]);
  });
});
