import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { migrate } from './migrate.js';

test('migrations create a working database once and preserve subsequent edits', async () => {
  const pool = new pg.Pool();
  try {
    await migrate(pool);
    assert.equal((await pool.query('SELECT count(*)::int AS count FROM artworks')).rows[0].count, 5);
    await pool.query("UPDATE artworks SET title = 'Edited' WHERE position = 1");
    await pool.query('DELETE FROM urban_interventions WHERE position = 1');
    await migrate(pool);
    assert.equal((await pool.query('SELECT title FROM artworks WHERE position = 1')).rows[0].title, 'Edited');
    assert.equal((await pool.query('SELECT count(*)::int AS count FROM urban_interventions')).rows[0].count, 3);
    assert.equal((await pool.query('SELECT count(*)::int AS count FROM schema_migrations')).rows[0].count, 3);
  } finally {
    await pool.end();
  }
});
