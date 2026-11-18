// tests/setup.ts
//
// Runs once before any test file. Loads the local environment and refuses
// to run anywhere else.

import { config } from 'dotenv';

config({ path: '.env.test' });

// ---------------------------------------------------------------------------
// Safety guard.
//
// The fixtures create users through the admin API and truncate tables between
// runs. Pointed at the hosted project, that would create real auth users --
// which persist until someone deletes them by hand -- and delete real data.
//
// A misconfigured .env.test, or a SUPABASE_URL already exported in the shell,
// is all it would take. This makes that mistake impossible rather than
// unlikely.
// ---------------------------------------------------------------------------
const url = process.env.SUPABASE_URL ?? '';

if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url)) {
  throw new Error(
    `Refusing to run tests against "${url}".\n` +
      'Tests create users and delete rows, and must only ever run against ' +
      'the local Supabase stack. Check .env.test, and check whether ' +
      'SUPABASE_URL is exported in your shell.',
  );
}

for (const key of ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY']) {
  if (!process.env[key]) {
    throw new Error(
      `${key} is not set. Copy it from the output of \`npx supabase start\` ` +
        'into .env.test.',
    );
  }
}
