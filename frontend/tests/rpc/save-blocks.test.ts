// tests/rpc/save-blocks.test.ts
//
// rk_save_blocks: the batched write the editor calls on every autosave.

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { seedWorlds, clientAs, admin, type Fixture } from '../fixtures';

let fx: Fixture;
let tomeId: string;

beforeAll(async () => {
  fx = await seedWorlds('save');
  tomeId = fx.tomes.draftPrivate.id;
}, 60_000);

beforeEach(async () => {
  await admin
    .from('blocks')
    .update({ locked_by: null, locked_at: null })
    .eq('tome_id', tomeId);
});

const blockIdsFor = async (id: string) => {
  const { data } = await admin
    .from('blocks').select('id, sort_key').eq('tome_id', id).order('sort_key');
  return data!;
};

describe('applying operations', () => {
  it('inserts a block', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const before = (await blockIdsFor(tomeId)).length;

    const { data, error } = await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        {
          op: 'insert',
          block: {
            type: 'paragraph',
            sort_key: 'b0',
            is_secret: false,
            content: fx.helpers.para('A new paragraph.'),
          },
        },
      ],
    });

    expect(error).toBeNull();
    expect(data.saved_at).toBeTruthy();
    expect((await blockIdsFor(tomeId)).length).toBe(before + 1);
  });

  it('honours a client-supplied id', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const id = crypto.randomUUID();

    await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        {
          op: 'insert',
          block: {
            id,
            type: 'paragraph',
            sort_key: 'b1',
            content: fx.helpers.para('Known id.'),
          },
        },
      ],
    });

    const { data } = await admin.from('blocks').select('id').eq('id', id);
    expect(data).toHaveLength(1);
  });

  it('updates, moves and deletes in one call', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const target = fx.tomes.draftPrivate.publicBlock.id;
    const doomed = fx.tomes.draftPrivate.secretBlock.id;

    const { error } = await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        { op: 'update', id: target, content: fx.helpers.para('Rewritten.') },
        { op: 'move',   id: target, sort_key: 'm5' },
        { op: 'delete', id: doomed },
      ],
    });

    expect(error).toBeNull();

    const { data: row } = await admin
      .from('blocks').select('sort_key, search_text').eq('id', target).single();
    expect(row!.sort_key).toBe('m5');
    expect(row!.search_text).toContain('Rewritten');

    const { data: gone } = await admin
      .from('blocks').select('id').eq('id', doomed);
    expect(gone).toEqual([]);
  });

  it('accepts an empty operation list', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data, error } = await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [],
    });

    expect(error).toBeNull();
    expect(data.saved_at).toBeTruthy();
  });

  it('rejects an unknown operation', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { error } = await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [{ op: 'obliterate', id: fx.tomes.draftPrivate.publicBlock.id }],
    });

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/unknown op/i);
  });
});

describe('locking', () => {
  it('refuses the batch when a target is held by someone else', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);
    const held = fx.tomes.draftPrivate.publicBlock.id;

    await b.rpc('rk_acquire_lock', { p_block_id: held });

    const { data } = await a.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [{ op: 'update', id: held, content: fx.helpers.para('Nope.') }],
    });

    expect(data.locked).toBeTruthy();
    expect(data.locked[0].id).toBe(held);
    expect(data.saved_at).toBeUndefined();
  });

  it('applies nothing at all when one target in the batch is locked', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    const { data: fresh } = await admin
      .from('blocks')
      .insert({
        tome_id: tomeId, type: 'paragraph', sort_key: 'c0',
        content: fx.helpers.para('Untouched.'),
      })
      .select().single();

    const held = fx.tomes.draftPrivate.publicBlock.id;
    await b.rpc('rk_acquire_lock', { p_block_id: held });

    await a.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        { op: 'update', id: fresh!.id, content: fx.helpers.para('Changed?') },
        { op: 'update', id: held,      content: fx.helpers.para('Blocked.') },
      ],
    });

    // The unlocked block in the same batch must be untouched -- the whole
    // point of checking locks in a first pass.
    const { data: row } = await admin
      .from('blocks').select('search_text').eq('id', fresh!.id).single();
    expect(row!.search_text).toContain('Untouched');
  });

  it('allows a save to a block the caller holds', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const held = fx.tomes.draftPrivate.publicBlock.id;

    await a.rpc('rk_acquire_lock', { p_block_id: held });

    const { data } = await a.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [{ op: 'update', id: held, content: fx.helpers.para('Mine.') }],
    });

    expect(data.saved_at).toBeTruthy();
  });

  it('ignores an expired lock', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);
    const held = fx.tomes.draftPrivate.publicBlock.id;

    await b.rpc('rk_acquire_lock', { p_block_id: held });
    await admin
      .from('blocks')
      .update({ locked_at: new Date(Date.now() - 3 * 60_000).toISOString() })
      .eq('id', held);

    const { data } = await a.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [{ op: 'update', id: held, content: fx.helpers.para('Taken.') }],
    });

    expect(data.saved_at).toBeTruthy();
  });
});

describe('permissions', () => {
  it('affects nothing when a player calls it', async () => {
    const player = await clientAs(fx.users.player.email!);
    const before = (await blockIdsFor(tomeId)).length;

    // security invoker means RLS applies inside the function: the inserts
    // match no rows the player may write, so nothing happens.
    await player.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        {
          op: 'insert',
          block: {
            type: 'paragraph', sort_key: 'z0',
            content: fx.helpers.para('Player was here.'),
          },
        },
      ],
    }).then(() => undefined, () => undefined);

    expect((await blockIdsFor(tomeId)).length).toBe(before);
  });

  it('will not write a block into a Tome in another World', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const foreign = fx.tomes.pubPublicInPublicWorld.publicBlock.id;

    await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,              // one Tome
      p_ops: [{ op: 'update', id: foreign, content: fx.helpers.para('X') }],
    });

    // Every statement is scoped by tome_id as well as block id, so an op
    // naming a block from a different Tome matches nothing.
    const { data } = await admin
      .from('blocks').select('search_text').eq('id', foreign).single();
    expect(data!.search_text).not.toContain('X');
  });
});

describe('side effects', () => {
  it('bumps the Tome updated_at', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data: before } = await admin
      .from('tomes').select('updated_at').eq('id', tomeId).single();

    await new Promise((r) => setTimeout(r, 10));

    await c.rpc('rk_save_blocks', {
      p_tome_id: tomeId,
      p_ops: [
        {
          op: 'insert',
          block: {
            type: 'paragraph', sort_key: 'd0',
            content: fx.helpers.para('Bump.'),
          },
        },
      ],
    });

    const { data: after } = await admin
      .from('tomes').select('updated_at').eq('id', tomeId).single();

    expect(new Date(after!.updated_at).getTime())
      .toBeGreaterThan(new Date(before!.updated_at).getTime());
  });
});
