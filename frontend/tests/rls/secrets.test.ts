// tests/rls/secrets.test.ts
//
// GM Secrets. The most important file in the suite: a mistake here is a
// content leak that produces no error and nothing in a log.

import { describe, it, expect, beforeAll } from 'vitest';
import { seedWorlds, clientAs, anonClient, type Fixture } from '../fixtures';

let fx: Fixture;

beforeAll(async () => {
  fx = await seedWorlds('secrets');
}, 60_000);

describe('published_blocks', () => {
  it('never sends a secret block to a player', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { data, error } = await c
      .from('published_blocks')
      .select('id, is_secret')
      .eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data!.some((b) => b.is_secret)).toBe(false);
  });

  // Paired with the test above. Without this one, a policy returning nothing
  // to anybody would pass.
  it('sends both blocks to the owner', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data } = await c
      .from('published_blocks')
      .select('id, is_secret')
      .eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(2);
    expect(data!.some((b) => b.is_secret)).toBe(true);
  });

  it('sends secrets to a contributor', async () => {
    const c = await clientAs(fx.users.contributor.email!);

    const { data } = await c
      .from('published_blocks')
      .select('id, is_secret')
      .eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(2);
  });

  it('never sends a secret block to an anonymous reader', async () => {
    const { data } = await anonClient()
      .from('published_blocks')
      .select('id, is_secret')
      .eq('tome_id', fx.tomes.pubPublicInPublicWorld.id);

    expect(data).toHaveLength(1);
    expect(data![0].is_secret).toBe(false);
  });

  it('does not send secrets to a granted reader without edit rights', async () => {
    const c = await clientAs(fx.users.grantedRead.email!);

    const { data } = await c
      .from('published_blocks')
      .select('id, is_secret')
      .eq('tome_id', fx.tomes.pubPrivate.id);

    expect(data).toHaveLength(1);
    expect(data![0].is_secret).toBe(false);
  });
});

describe('draft blocks', () => {
  it('gives a player zero rows, secret or not', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { data } = await c
      .from('blocks')
      .select('id')
      .eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toEqual([]);
  });

  it('gives an editor every row', async () => {
    const c = await clientAs(fx.users.coBuilder.email!);

    const { data } = await c
      .from('blocks')
      .select('id')
      .eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(2);
  });
});

describe('secret connections', () => {
  it('hides a GM-only connection from a player', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { data } = await c
      .from('published_connections')
      .select('id, is_secret')
      .eq('from_tome_id', fx.tomes.pubUnlisted.id);

    expect(data!.some((row) => row.is_secret)).toBe(false);
  });

  it('shows both connections to an editor', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data } = await c
      .from('published_connections')
      .select('id, is_secret')
      .eq('from_tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(2);
  });
});

describe('search', () => {
  it('does not surface secret text to a player', async () => {
    const c = await clientAs(fx.users.player.email!);

    const { data } = await c
      .from('published_blocks')
      .select('id, search_text')
      .eq('tome_id', fx.tomes.pubUnlisted.id)
      .ilike('search_text', '%forgery%');

    expect(data).toEqual([]);
  });

  it('does surface it to an editor', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data } = await c
      .from('published_blocks')
      .select('id, search_text')
      .eq('tome_id', fx.tomes.pubUnlisted.id)
      .ilike('search_text', '%forgery%');

    expect(data).toHaveLength(1);
  });
});
