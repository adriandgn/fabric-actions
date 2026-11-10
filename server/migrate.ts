import { readFile, readdir } from 'node:fs/promises';
import type { Pool } from 'pg';

const directory = new URL('../database/', import.meta.url);

export async function migrate(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('fabric-actions:migrations'))");
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    const files = (await readdir(directory)).filter((file) => /^\d{3}_[a-z0-9_]+\.sql$/.test(file)).sort();
    for (const file of files) {
      const version = file.slice(0, -4);
      const existing = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);
      if (existing.rowCount) continue;
      await client.query(await readFile(new URL(file, directory), 'utf8'));
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);
      if (!applied.rowCount) throw new Error(`Migration ${version} did not record its completion.`);
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('fabric-actions:migrations'))").catch(() => undefined);
    client.release();
  }
}
