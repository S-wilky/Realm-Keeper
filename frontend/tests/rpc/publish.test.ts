// tests/rpc/publish.test.ts
//
// Publishing and draft divergence. Editors read and write `blocks`;
// everyone else reads `published_blocks`. Edits to the draft must not
// reach readers until the Tome is published again.

import { describe, it, expect, beforeAll } from 'vitest';
import { seedWorlds, clientAs, admin, type Fixture } from '../fixtures';

let fx: Fixture;

beforeAll(async () => {
  fx = await seedWorlds('publish');
}, 60_000);

describe('publishing', () => {
  it('copies draft blocks into the published table', async () => {
    const { data: draft } = await admin
      .from('blocks').select('id').eq('tome_id', fx.tomes.pubUnlisted.id);
    const { data: published } = await admin
      .from('published_blocks').select('id').eq('tome_id', fx.tomes.pubUnlisted.id);

    expect(published).toHaveLength(draft!.length);
  });

  it('keeps the same ids, so block deep links survive', async () => {
    const { data: draft } = await admin
      .from('blocks').select('id').eq('tome_id', fx.tomes.pubUnlisted.id)
      .order('sort_key');
    const { data: published } = await admin
      .from('published_blocks').select('id').eq('tome_id', fx.tomes.pubUnlisted.id)
      .order('sort_key');

    expect(published!.map((b) => b.id)).toEqual(draft!.map((b) => b.id));
  });

  it('stamps published_at and published_by', async () => {
    const { data } = await admin
      .from('tomes').select('published_at, published_by')
      .eq('id', fx.tomes.pubUnlisted.id).single();

    expect(data!.published_at).not.toBeNull();
    expect(data!.published_by).toBe(fx.users.owner.id);
  });

  it('writes a snapshot version marked is_publish', async () => {
    const { data } = await admin
      .from('tome_versions').select('snapshot, is_publish')
      .eq('tome_id', fx.tomes.pubUnlisted.id).eq('is_publish', true);

    expect(data!.length).toBeGreaterThan(0);
    expect(Array.isArray(data![0].snapshot)).toBe(true);
  });

  it('copies connections too', async () => {
    const { data } = await admin
      .from('published_connections').select('id')
      .eq('from_tome_id', fx.tomes.pubUnlisted.id);

    expect(data).toHaveLength(2);
  });

  it('refuses a caller without edit rights', async () => {
    const player = await clientAs(fx.users.player.email!);

    const { error } = await player.rpc('rk_publish_tome', {
      p_tome_id: fx.tomes.pubUnlisted.id,
    });

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/not permitted/i);
  });
});

describe('divergence', () => {
  it('does not show draft edits to readers until republished', async () => {
    const owner = await clientAs(fx.users.owner.email!);
    const player = await clientAs(fx.users.player.email!);
    const blockId = fx.tomes.pubUnlisted.publicBlock.id;

    await owner.rpc('rk_save_blocks', {
      p_tome_id: fx.tomes.pubUnlisted.id,
      p_ops: [
        { op: 'update', id: blockId, content: fx.helpers.para('Secretly revised.') },
      ],
    });

    const { data: seen } = await player
      .from('published_blocks').select('search_text').eq('id', blockId).single();

    expect(seen!.search_text).not.toContain('Secretly revised');
  });

  it('shows the edit after republishing', async () => {
    const owner = await clientAs(fx.users.owner.email!);
    const player = await clientAs(fx.users.player.email!);
    const blockId = fx.tomes.pubUnlisted.publicBlock.id;

    await owner.rpc('rk_publish_tome', { p_tome_id: fx.tomes.pubUnlisted.id });

    const { data: seen } = await player
      .from('published_blocks').select('search_text').eq('id', blockId).single();

    expect(seen!.search_text).toContain('Secretly revised');
  });

  it('signals unpublished changes via updated_at vs published_at', async () => {
    const owner = await clientAs(fx.users.owner.email!);

    await new Promise((r) => setTimeout(r, 10));
    await owner.rpc('rk_save_blocks', {
      p_tome_id: fx.tomes.pubUnlisted.id,
      p_ops: [
        {
          op: 'insert',
          block: {
            type: 'paragraph', sort_key: 'q0',
            content: fx.helpers.para('Pending.'),
          },
        },
      ],
    });

    const { data } = await admin
      .from('tomes').select('updated_at, published_at')
      .eq('id', fx.tomes.pubUnlisted.id).single();

    expect(new Date(data!.updated_at).getTime())
      .toBeGreaterThan(new Date(data!.published_at).getTime());
  });
});

describe('unpublishing', () => {
  it('removes the published copy and hides the Tome from readers', async () => {
    const owner = await clientAs(fx.users.owner.email!);
    const player = await clientAs(fx.users.player.email!);
    const tomeId = fx.tomes.pubPublicInPublicWorld.id;

    await owner.rpc('rk_unpublish_tome', { p_tome_id: tomeId });

    const { data: blocks } = await admin
      .from('published_blocks').select('id').eq('tome_id', tomeId);
    expect(blocks).toEqual([]);

    const { data: visible } = await player
      .from('tomes').select('id').eq('id', tomeId);
    expect(visible).toEqual([]);
  });

  it('leaves the draft content intact', async () => {
    const { data } = await admin
      .from('blocks').select('id')
      .eq('tome_id', fx.tomes.pubPublicInPublicWorld.id);

    expect(data!.length).toBeGreaterThan(0);
  });

  it('does not change the author-facing status', async () => {
    // Unpublishing removes the published copy. It is not a judgement about
    // whether the writing is finished.
    const owner = await clientAs(fx.users.owner.email!);
    const tomeId = fx.tomes.pubPrivate.id;

    await admin.from('tomes').update({ status: 'finished' }).eq('id', tomeId);
    await owner.rpc('rk_unpublish_tome', { p_tome_id: tomeId });

    const { data } = await admin
      .from('tomes').select('status').eq('id', tomeId).single();

    expect(data!.status).toBe('finished');
  });
});
