import pg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { createApp } from './app.js';
import { migrate } from './migrate.js';
import path from 'node:path';

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ADMIN_PASSWORD, SESSION_SECRET, ALLOWED_ORIGINS, UPLOAD_DIR, NODE_ENV, BREVO_API_KEY, BREVO_LIST_ID } = process.env;
if (!(DATABASE_URL || (PGHOST && PGDATABASE && PGUSER && PGPASSWORD)) || !ADMIN_PASSWORD || !SESSION_SECRET || !ALLOWED_ORIGINS || !UPLOAD_DIR || !path.isAbsolute(UPLOAD_DIR)) {
  throw new Error('Database connection, ADMIN_PASSWORD, SESSION_SECRET, ALLOWED_ORIGINS, and an absolute UPLOAD_DIR are required.');
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT.');
if (Boolean(BREVO_API_KEY) !== Boolean(BREVO_LIST_ID) || (BREVO_LIST_ID && (!Number.isSafeInteger(Number(BREVO_LIST_ID)) || Number(BREVO_LIST_ID) < 1))) {
  throw new Error('BREVO_API_KEY and a positive BREVO_LIST_ID must be configured together.');
}
const pool = DATABASE_URL ? new pg.Pool({ connectionString: DATABASE_URL }) : new pg.Pool();
await migrate(pool);
const PgStore = connectPgSimple(session);
const store = new PgStore({ pool, tableName: 'user_sessions', createTableIfMissing: false });
const app = createApp({
  password: ADMIN_PASSWORD,
  sessionSecret: SESSION_SECRET,
  allowedOrigins: ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
  secureCookies: NODE_ENV === 'production',
  store,
  pool,
  uploadDir: UPLOAD_DIR,
  newsletter: BREVO_API_KEY && BREVO_LIST_ID ? { apiKey: BREVO_API_KEY, listId: Number(BREVO_LIST_ID) } : undefined,
  staticDir: path.resolve(process.env.STATIC_DIR ?? 'dist'),
  canonicalHost: 'fabric-actions.therapy-berlin.com',
  redirectHost: 'fabric-actions.art',
});

app.listen(port, '0.0.0.0', () => console.log(`API listening on port ${port}`));
