// tests/rls/write-access.test.ts
//
// Who can write what. Note the shape difference from the read tests:
// a denied write returns an error, a denied read returns an empty array.

import { describe, it, expect, beforeAll } from 'vitest';
import { seedWorlds, clientAs, anonClient, type Fixture } from '../fixtures';

let fx: Fixture;

beforeAll(async () => {
  fx = await seedWorlds('write');
}, 60_000);

describe('block writes', () => {
  it('lets a contributor edit a block', async () => {
    const c = await clientAs(fx.users.contributor.email!);

    const { error } = await c
      .from('blocks')
      .update({ content: fx.helpers.para('Edited by a contributor.') })
      .eq('id', fx.tomes.draftPrivate.publicBlock.id);

    expect(error).toBeNull();
  });

  it('silently affects nothing when a player tries to edit', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { data, error } = await c
      .from('blocks')
      .update({ content: fx.helpers.para('Player was here.') })
      .eq('id', fx.tomes.draftPrivate.publicBlock.id)
      .select();

    // A player cannot see the row, so the UPDATE matches nothing. This is a
    // no-op rather than an error -- the row count is what proves it failed.
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('refuses an insert from a player', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { error } = await c.from('blocks').insert({
      tome_id: fx.tomes.draftPrivate.id,
      type: 'paragraph',
      sort_key: 'z9',
      content: fx.helpers.para('Should not exist.'),
    });

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/row-level security/i);
  });

  it('refuses an insert from an anonymous client', async () => {
    const { error } = await anonClient().from('blocks').insert({
      tome_id: fx.tomes.draftPrivate.id,
      type: 'paragraph',
      sort_key: 'z8',
      content: fx.helpers.para('Should not exist.'),
    });

    expect(error).not.toBeNull();
  });
});

describe('per-Tome grants', () => {
  it('lets a granted editor write', async () => {
    const c = await clientAs(fx.users.grantedEdit.email!);

    const { data, error } = await c
      .from('blocks')
      .update({ content: fx.helpers.para('Granted editor was here.') })
      .eq('id', fx.tomes.draftPrivate.publicBlock.id)
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('does not let a granted READER write', async () => {
    const c = await clientAs(fx.users.grantedRead.email!);

    const { data, error } = await c
      .from('blocks')
      .update({ content: fx.helpers.para('Reader was here.') })
      .eq('id', fx.tomes.pubPrivate.publicBlock.id)
      .select();

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});

describe('world membership', () => {
  it('does not let a co-builder add members', async () => {
    const c = await clientAs(fx.users.coBuilder.email!);

    const { error } = await c.from('world_members').insert({
      world_id: fx.worlds.privateWorld.id,
      user_id: fx.users.outsider.id,
      role: 'player',
    });

    expect(error).not.toBeNull();
  });

  it('lets the owner add a member', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('world_members').insert({
      world_id: fx.worlds.publicWorld.id,
      user_id: fx.users.outsider.id,
      role: 'player',
    });

    expect(error).toBeNull();
  });
});

describe('tome metadata', () => {
  it('refuses a duplicate title within a World', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('tomes').insert({
      world_id: fx.worlds.privateWorld.id,
      type: 'location',
      title: fx.tomes.draftPrivate.title,  // already taken
      created_by: fx.users.owner.id,
    });

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/tomes_title_unique_per_world|duplicate key/i);
  });

  it('allows the same title in a different World', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('tomes').insert({
      world_id: fx.worlds.publicWorld.id,
      type: 'location',
      title: fx.tomes.draftPrivate.title,
      created_by: fx.users.owner.id,
    });

    expect(error).toBeNull();
  });

  it('refuses a duplicate alias within a World', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const first = await c.from('tome_aliases').insert({
      tome_id: fx.tomes.draftPrivate.id,
      world_id: fx.worlds.privateWorld.id,
      alias: `The Burned King ${fx.label}`,
    });
    expect(first.error).toBeNull();

    const second = await c.from('tome_aliases').insert({
      tome_id: fx.tomes.pubPrivate.id,
      world_id: fx.worlds.privateWorld.id,
      alias: `The Burned King ${fx.label}`,
    });
    expect(second.error).not.toBeNull();
  });
});

describe('tone tags', () => {
  it('accepts a tone tag from the controlled list', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('world_tags').insert({
      world_id: fx.worlds.privateWorld.id,
      kind: 'tone',
      tag: 'gritty',
    });

    expect(error).toBeNull();
  });

  it('rejects a tone tag that is not in the list', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('world_tags').insert({
      world_id: fx.worlds.privateWorld.id,
      kind: 'tone',
      tag: 'swashbuckling',
    });

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/unknown tone tag/i);
  });

  it('accepts any freeform genre tag', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.from('world_tags').insert({
      world_id: fx.worlds.privateWorld.id,
      kind: 'genre',
      tag: 'swashbuckling',
    });

    expect(error).toBeNull();
  });
});
