// tests/triggers.test.ts
//
// Derived data. Everything here is maintained by a trigger rather than by
// the application, so an import, a restore and an ordinary save all produce
// the same result.

import { describe, it, expect, beforeAll } from 'vitest';
import { seedWorlds, clientAs, admin, type Fixture } from './fixtures';

let fx: Fixture;

beforeAll(async () => {
  fx = await seedWorlds('triggers');
}, 60_000);

describe('search_text extraction', () => {
  it('pulls plain text out of Tiptap JSON', async () => {
    const { data } = await admin
      .from('blocks').select('search_text')
      .eq('id', fx.tomes.draftPrivate.publicBlock.id).single();

    expect(data!.search_text).toContain('The hollow burned in spring');
  });

  it('does not duplicate text', async () => {
    // jsonpath lax mode unwraps arrays during recursive descent and returns
    // every string twice. The function uses strict mode for this reason;
    // this test is the regression guard.
    const { data } = await admin
      .from('blocks').select('search_text')
      .eq('id', fx.tomes.draftPrivate.publicBlock.id).single();

    const occurrences = data!.search_text!.split('hollow').length - 1;
    expect(occurrences).toBe(1);
  });

  it('handles a block with no text at all', async () => {
    const { data, error } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'divider',
        sort_key: 't0',
        content: {},
      })
      .select().single();

    expect(error).toBeNull();
    expect(data!.search_text).toBe('');
  });

  it('updates when content changes', async () => {
    const c = await clientAs(fx.users.owner.email!);
    const id = fx.tomes.draftPrivate.secretBlock.id;

    await c.from('blocks')
      .update({ content: fx.helpers.para('Entirely different words.') })
      .eq('id', id);

    const { data } = await admin
      .from('blocks').select('search_text').eq('id', id).single();

    expect(data!.search_text).toContain('Entirely different');
    expect(data!.search_text).not.toContain('forgery');
  });
});

describe('tome_links index', () => {
  it('records an inline link to another Tome', async () => {
    const c = await clientAs(fx.users.owner.email!);

    const { data: block } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'paragraph',
        sort_key: 'u0',
        content: fx.helpers.paraWithLink('Kestrel Hollow', fx.tomes.pubPrivate.id),
      })
      .select().single();

    const { data: links } = await admin
      .from('tome_links').select('to_tome_id').eq('from_block_id', block!.id);

    expect(links).toHaveLength(1);
    expect(links![0].to_tome_id).toBe(fx.tomes.pubPrivate.id);
  });

  it('rewrites the index when the link is removed', async () => {
    const { data: block } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'paragraph',
        sort_key: 'u1',
        content: fx.helpers.paraWithLink('Temporary', fx.tomes.pubPrivate.id),
      })
      .select().single();

    await admin.from('blocks')
      .update({ content: fx.helpers.para('No link any more.') })
      .eq('id', block!.id);

    const { data: links } = await admin
      .from('tome_links').select('to_tome_id').eq('from_block_id', block!.id);

    expect(links).toEqual([]);
  });

  it('skips a link to a Tome that does not exist', async () => {
    const { error } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'paragraph',
        sort_key: 'u2',
        content: fx.helpers.paraWithLink('Ghost', crypto.randomUUID()),
      });

    // The mark stays in the content and renders as a broken link.
    // It must not fail the write.
    expect(error).toBeNull();
  });

  it('skips a self-reference', async () => {
    const { data: block } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'paragraph',
        sort_key: 'u3',
        content: fx.helpers.paraWithLink('Itself', fx.tomes.draftPrivate.id),
      })
      .select().single();

    const { data: links } = await admin
      .from('tome_links').select('to_tome_id').eq('from_block_id', block!.id);

    expect(links).toEqual([]);
  });

  it('cleans itself up when the target Tome is deleted', async () => {
    const { data: target } = await admin
      .from('tomes')
      .insert({
        world_id: fx.worlds.privateWorld.id,
        type: 'note',
        title: `Doomed ${fx.label}`,
        created_by: fx.users.owner.id,
      })
      .select().single();

    const { data: block } = await admin
      .from('blocks')
      .insert({
        tome_id: fx.tomes.draftPrivate.id,
        type: 'paragraph',
        sort_key: 'u4',
        content: fx.helpers.paraWithLink('Doomed', target!.id),
      })
      .select().single();

    expect(
      (await admin.from('tome_links').select('*').eq('from_block_id', block!.id)).data,
    ).toHaveLength(1);

    await admin.from('tomes').delete().eq('id', target!.id);

    const { data: after } = await admin
      .from('tome_links').select('*').eq('from_block_id', block!.id);
    expect(after).toEqual([]);
  });
});

describe('updated_at', () => {
  it('moves when a row changes', async () => {
    const { data: before } = await admin
      .from('blocks').select('updated_at')
      .eq('id', fx.tomes.draftPrivate.publicBlock.id).single();

    await new Promise((r) => setTimeout(r, 10));

    await admin.from('blocks')
      .update({ content: fx.helpers.para('Touched.') })
      .eq('id', fx.tomes.draftPrivate.publicBlock.id);

    const { data: after } = await admin
      .from('blocks').select('updated_at')
      .eq('id', fx.tomes.draftPrivate.publicBlock.id).single();

    expect(new Date(after!.updated_at).getTime())
      .toBeGreaterThan(new Date(before!.updated_at).getTime());
  });
});

describe('world owner membership', () => {
  it('makes the creator a member on insert', async () => {
    const { data: world } = await admin
      .from('worlds')
      .insert({
        name: `Bootstrap ${fx.label}`,
        owner_id: fx.users.outsider.id,
        visibility: 'private',
      })
      .select().single();

    const { data: members } = await admin
      .from('world_members').select('user_id, role').eq('world_id', world!.id);

    expect(members).toHaveLength(1);
    expect(members![0].user_id).toBe(fx.users.outsider.id);
    expect(members![0].role).toBe('owner');
  });

  it('leaves a newly created World visible to its creator', async () => {
    // Without the trigger, the row would be invisible to its own owner the
    // moment RLS applied -- created successfully, then gone.
    const c = await clientAs(fx.users.outsider.email!);

    const { data, error } = await c
      .from('worlds')
      .insert({
        name: `Self Visible ${fx.label}`,
        owner_id: fx.users.outsider.id,
        visibility: 'private',
      })
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });
});

describe('uuidv7', () => {
  it('generates ids that sort in creation order', async () => {
    const ids: string[] = [];

    for (let i = 0; i < 5; i++) {
      const { data } = await admin
        .from('blocks')
        .insert({
          tome_id: fx.tomes.draftPrivate.id,
          type: 'paragraph',
          sort_key: `v${i}`,
          content: fx.helpers.para(`Ordering ${i}.`),
        })
        .select('id').single();
      ids.push(data!.id);
      await new Promise((r) => setTimeout(r, 5));
    }

    expect([...ids].sort()).toEqual(ids);
  });

  it('sets the version nibble to 7', async () => {
    const { data } = await admin
      .from('blocks').select('id')
      .eq('id', fx.tomes.draftPrivate.publicBlock.id).single();

    expect(data!.id[14]).toBe('7');
  });
});
