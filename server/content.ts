import { Router } from 'express';
import type { Pool } from 'pg';
import { z } from 'zod';

const text = z.string().trim().min(1).max(500);
const optionalText = z.string().max(5000).nullable().optional();
const image = z.string().regex(/^\/(img|uploads)\/[a-zA-Z0-9_.-]+$/).nullable().optional();
const position = z.number().int().min(0).max(100000).default(0);

const schemas = {
  events: z.object({ title: text, event_date: z.string().date().nullable().optional(), location: optionalText,
    description: optionalText, link_url: z.string().max(2048).regex(/^(#|https:\/\/)/).nullable().optional(),
    exhibition_group: z.enum(['next', 'latest']).default('latest'), position }).strict(),
  artworks: z.object({ title: text, year: z.number().int().min(1).max(9999).nullable().optional(),
    description: optionalText, image_url: image, position }).strict(),
  urban_interventions: z.object({ title: text, date: text, description: optionalText, image_url: image, position }).strict(),
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
