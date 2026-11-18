import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],

    // These tests share one local database. Running files in parallel
    // means two tests fighting over the same rows. This is the single
    // most common way a working suite starts failing at random.
    fileParallelism: false,

    testTimeout: 20_000,
  },
});
