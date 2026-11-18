// tests/rpc/locks.test.ts
//
// Block locking. A lock is refreshed by a 30-second heartbeat while the
// block has focus, so an actively-held lock is never more than ~30 seconds
// old. The two-minute window is time since the holder's browser went quiet,
// not time since they started editing.

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { seedWorlds, clientAs, admin, type Fixture } from '../fixtures';

let fx: Fixture;
let blockId: string;

beforeAll(async () => {
  fx = await seedWorlds('locks');
  blockId = fx.tomes.draftPrivate.publicBlock.id;
}, 60_000);

beforeEach(async () => {
  // Clear any lock left by the previous test.
  await admin
    .from('blocks')
    .update({ locked_by: null, locked_at: null })
    .eq('id', blockId);
});

/** Pretend the holder's browser stopped heartbeating `minutes` ago. */
async function stopHeartbeating(id: string, minutes: number) {
  await admin
    .from('blocks')
    .update({ locked_at: new Date(Date.now() - minutes * 60_000).toISOString() })
    .eq('id', id);
}

describe('acquiring', () => {
  it('gives the lock to the first caller', async () => {
    const a = await clientAs(fx.users.owner.email!);

    const { data } = await a.rpc('rk_acquire_lock', { p_block_id: blockId });

    expect(data.acquired).toBe(true);
  });

  it('refuses a second holder while the first is heartbeating', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    const { data } = await b.rpc('rk_acquire_lock', { p_block_id: blockId });

    expect(data.acquired).toBe(false);
    expect(data.reason).toBe('held');
    expect(data.held_by).toBe(fx.users.owner.id);
  });

  it('is idempotent for the holder', async () => {
    const a = await clientAs(fx.users.owner.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    const { data } = await a.rpc('rk_acquire_lock', { p_block_id: blockId });

    expect(data.acquired).toBe(true);
  });

  it('does not reveal a block the caller cannot see', async () => {
    const player = await clientAs(fx.users.player.email!);

    const { data } = await player.rpc('rk_acquire_lock', {
      p_block_id: blockId,
    });

    // 'unavailable', never 'held' -- a player must not learn that the block
    // exists, nor who is editing it.
    expect(data.acquired).toBe(false);
    expect(data.reason).toBe('unavailable');
    expect(data.held_by).toBeUndefined();
  });
});

describe('expiry', () => {
  it('does NOT expire a lock that is still being heartbeated', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });

    // Four minutes pass, but the holder's client keeps heartbeating.
    await stopHeartbeating(blockId, 4);
    const beat = await a.rpc('rk_heartbeat_lock', { p_block_id: blockId });
    expect(beat.data).toBe(true);

    const { data } = await b.rpc('rk_acquire_lock', { p_block_id: blockId });
    expect(data.acquired).toBe(false);
  });

  it('allows takeover once the holder stops heartbeating', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    await stopHeartbeating(blockId, 3);

    const { data } = await b.rpc('rk_acquire_lock', { p_block_id: blockId });
    expect(data.acquired).toBe(true);
  });

  it('tells a holder their lock was lost', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    await stopHeartbeating(blockId, 3);
    await b.rpc('rk_acquire_lock', { p_block_id: blockId });

    const { data } = await a.rpc('rk_heartbeat_lock', { p_block_id: blockId });
    expect(data).toBe(false);
  });
});

describe('releasing', () => {
  it('frees the block for someone else', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    await a.rpc('rk_release_lock', { p_block_id: blockId });

    const { data } = await b.rpc('rk_acquire_lock', { p_block_id: blockId });
    expect(data.acquired).toBe(true);
  });

  it('does not let a non-holder release someone else lock', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await a.rpc('rk_acquire_lock', { p_block_id: blockId });
    await b.rpc('rk_release_lock', { p_block_id: blockId });

    const { data } = await admin
      .from('blocks').select('locked_by').eq('id', blockId).single();

    expect(data!.locked_by).toBe(fx.users.owner.id);
  });
});

describe('the lock guard', () => {
  it('refuses a lock taken in someone else name', async () => {
    const a = await clientAs(fx.users.owner.email!);

    const { error } = await a
      .from('blocks')
      .update({
        locked_by: fx.users.coBuilder.id,
        locked_at: new Date().toISOString(),
      })
      .eq('id', blockId);

    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/locked_by must be the current user/);
  });

  it('still allows an ordinary content write that leaves the lock alone', async () => {
    const a = await clientAs(fx.users.owner.email!);
    const b = await clientAs(fx.users.coBuilder.email!);

    await b.rpc('rk_acquire_lock', { p_block_id: blockId });

    // `a` writes content without touching locked_by. The guard must not fire
    // just because the row happens to carry someone else's lock.
    const { error } = await a
      .from('blocks')
      .update({ content: fx.helpers.para('Direct write.') })
      .eq('id', blockId);

    expect(error).toBeNull();
  });
});
