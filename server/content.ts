import { Router } from 'express';
import type { Pool } from 'pg';
import { z } from 'zod';

const text = z.string().trim().min(1).max(500);
const optionalText = z.string().max(5000).nullable().optional();
const image = z.string().regex(/^\/(img|uploads)\/[a-zA-Z0-9_.-]+$/).nullable().optional();
const position = z.number().int().min(0).max(100000).default(0);

const schemas = {
  events: z.object({ title: text, event_date: z.string().date().nullable().optional(), end_date: z.string().date().nullable().optional(), location: optionalText,
    description: optionalText, link_url: z.string().max(2048).regex(/^(#|https:\/\/)/).nullable().optional(),
    exhibition_group: z.enum(['next', 'latest']).default('latest'), position }).strict().refine(data => !data.event_date || !data.end_date || data.end_date >= data.event_date),
  artworks: z.object({ title: text, year: z.number().int().min(1).max(9999), month: z.number().int().min(1).max(12),
    description: optionalText, image_url: image, position }).strict(),
  urban_interventions: z.object({ title: text, date: text, month: z.number().int().min(1).max(12), year: z.number().int().min(1).max(9999), description: optionalText, image_url: image, position }).strict(),
  event_posts: z.object({ title: text, subtitle: optionalText, content: z.string().min(1).max(100000), position }).strict(),
  exhibition_info: z.object({ last_exhibition: z.string().max(500), header_label: z.string().max(500),
    next_exhibition: z.string().max(500), next_exhibition_date: z.string().max(500),
    next_exhibition_address: z.string().max(1000) }).strict(),
} as const;

type Collection = keyof typeof schemas;
function isCollection(value: string): value is Collection {
  return Object.hasOwn(schemas, value);
}
function validId(value: string) { return /^[1-9][0-9]{0,17}$/.test(value); }

export function contentRouter(pool: Pool) {
  const router = Router();
  router.get('/:collection', async (req, res) => {
    const { collection } = req.params;
    if (!isCollection(collection)) { res.sendStatus(404); return; }
    const ordering = collection === 'exhibition_info' ? 'id' : 'position, id';
    const result = await pool.query(`SELECT * FROM ${collection} ORDER BY ${ordering}`);
    res.json(result.rows);
  });

  router.use((req, res, next) => {
    if (!req.session.admin) { res.sendStatus(401); return; }
    next();
  });

  router.post('/:collection/reorder', async (req, res) => {
    const { collection } = req.params;
    if (collection !== 'artworks' && collection !== 'urban_interventions') { res.sendStatus(404); return; }
    const parsed = z.object({ ids: z.array(z.union([z.string(), z.number()]).transform(String)).min(1).max(10000) }).strict().safeParse(req.body);
    if (!parsed.success || parsed.data.ids.some(id => !validId(id)) || new Set(parsed.data.ids).size !== parsed.data.ids.length) { res.sendStatus(400); return; }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`LOCK TABLE ${collection} IN EXCLUSIVE MODE`);
      const current = await client.query(`SELECT id FROM ${collection}`);
      const existing = new Set(current.rows.map(row => String(row.id)));
      if (existing.size !== parsed.data.ids.length || parsed.data.ids.some(id => !existing.has(id))) { await client.query('ROLLBACK'); res.sendStatus(409); return; }
      for (const [index, id] of parsed.data.ids.entries()) await client.query(`UPDATE ${collection} SET position = $1 WHERE id = $2`, [index + 1, id]);
      await client.query('COMMIT');
      res.sendStatus(204);
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  });

  router.post('/:collection', async (req, res) => {
    const { collection } = req.params;
    if (!isCollection(collection)) { res.sendStatus(404); return; }
    if (collection === 'exhibition_info') { res.sendStatus(405); return; }
    const parsed = schemas[collection].safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Invalid content' }); return; }
    const entries = Object.entries(parsed.data).filter(([, value]) => value !== undefined);
    const columns = entries.map(([key]) => key);
    const placeholders = entries.map((_, index) => `$${index + 1}`);
    const result = await pool.query(
      `INSERT INTO ${collection} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      entries.map(([, value]) => value),
    );
    res.status(201).json(result.rows[0]);
  });

  router.put('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    if (!isCollection(collection) || !validId(id)) { res.sendStatus(404); return; }
    if (collection === 'exhibition_info' && id !== '1') { res.sendStatus(404); return; }
    const parsed = schemas[collection].safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Invalid content' }); return; }
    const entries = Object.entries(parsed.data).filter(([, value]) => value !== undefined);
    const assignments = entries.map(([key], index) => `${key} = $${index + 1}`);
    const result = await pool.query(
      `UPDATE ${collection} SET ${assignments.join(', ')} WHERE id = $${entries.length + 1} RETURNING *`,
      [...entries.map(([, value]) => value), id],
    );
    if (!result.rowCount) { res.sendStatus(404); return; }
    res.json(result.rows[0]);
  });

  router.delete('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    if (!isCollection(collection) || !validId(id)) { res.sendStatus(404); return; }
    if (collection === 'exhibition_info') { res.sendStatus(405); return; }
    const result = await pool.query(`DELETE FROM ${collection} WHERE id = $1`, [id]);
    res.sendStatus(result.rowCount ? 204 : 404);
  });
  return router;
}
