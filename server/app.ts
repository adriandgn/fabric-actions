import crypto from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { z } from 'zod';
import type { Pool } from 'pg';
import { contentRouter } from './content.js';

declare module 'express-session' {
  interface SessionData { admin?: boolean }
}

export interface AppOptions {
  password: string;
  sessionSecret: string;
  store: session.Store;
  allowedOrigins: string[];
  secureCookies: boolean;
  pool?: Pool;
  uploadDir?: string;
  newsletter?: { apiKey: string; listId: number; fetch?: (url: string, init: RequestInit) => Promise<Response> };
  staticDir?: string;
  canonicalHost?: string;
  redirectHost?: string;
}

export function createApp(options: AppOptions) {
  if (options.password.length < 16 || options.sessionSecret.length < 32 || options.allowedOrigins.length === 0) {
    throw new Error('The admin password, session secret, and allowed origins must be configured securely.');
  }

  const app = express();
  app.disable('x-powered-by');
  if (options.secureCookies) app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", 'https://www.googletagmanager.com'],
        connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com'],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://www.googletagmanager.com'],
        upgradeInsecureRequests: options.secureCookies ? [] : null,
      },
    },
  }));
  app.use((req, res, next) => {
    if (options.canonicalHost && options.redirectHost && req.hostname === options.redirectHost) {
      res.redirect(308, `https://${options.canonicalHost}${req.originalUrl}`);
      return;
    }
    next();
  });
  app.use(express.json({ limit: '64kb' }));
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const origin = req.get('origin');
      if (!origin || !options.allowedOrigins.includes(origin)) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
    }
    next();
  });
  app.use(session({
    name: 'fabric.sid',
    secret: options.sessionSecret,
    store: options.store,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: options.secureCookies, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 },
  }));

  const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
  app.post('/api/session/login', loginLimit, (req, res, next) => {
    const candidate = typeof req.body?.password === 'string' ? req.body.password : '';
    const digest = (value: string) => crypto.createHash('sha256').update(value).digest();
    if (!crypto.timingSafeEqual(digest(candidate), digest(options.password))) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.admin = true;
      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        res.sendStatus(204);
      });
    });
  });
  app.get('/api/health', async (_req, res) => {
    if (!options.pool) { res.sendStatus(503); return; }
    try { await options.pool.query('SELECT 1'); res.json({ ok: true }); }
    catch { res.sendStatus(503); }
  });
  app.get('/api/session', (req, res) => res.json({ authenticated: req.session.admin === true }));
  const newsletterLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
  app.post('/api/newsletter', newsletterLimit, async (req, res) => {
    const parsed = z.object({ email: z.string().trim().email().max(254) }).strict().safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Invalid email address' }); return; }
    if (!options.newsletter) { res.sendStatus(503); return; }
    try {
      const response = await (options.newsletter.fetch ?? fetch)('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': options.newsletter.apiKey },
        body: JSON.stringify({ email: parsed.data.email, listIds: [options.newsletter.listId], updateEnabled: true }),
        signal: AbortSignal.timeout(10000),
      });
      res.sendStatus(response.ok ? 204 : 502);
    } catch {
      res.sendStatus(502);
    }
  });
  app.post('/api/session/logout', (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error);
      res.clearCookie('fabric.sid', { httpOnly: true, secure: options.secureCookies, sameSite: 'lax' });
      res.sendStatus(204);
    });
  });
  app.get('/api/admin/ping', (req, res) => {
    if (!req.session.admin) { res.sendStatus(401); return; }
    res.json({ ok: true });
  });
  if (options.pool) app.use('/api/content', contentRouter(options.pool));
  if (options.uploadDir) {
    const uploadDir = path.resolve(options.uploadDir);
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0, parts: 1 } });
    const uploadLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
    app.use('/uploads', express.static(uploadDir, { index: false, dotfiles: 'deny', immutable: true, maxAge: '1y' }));
    app.post('/api/uploads', (req, res, next) => {
      if (!req.session.admin) { res.sendStatus(401); return; }
      next();
    }, uploadLimit, upload.single('image'), async (req, res) => {
      if (!req.file) { res.sendStatus(400); return; }
      let type;
      try { type = await fileTypeFromBuffer(req.file.buffer); } catch { res.sendStatus(415); return; }
      if (!type || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type.mime)) {
        res.sendStatus(415); return;
      }
      await mkdir(uploadDir, { recursive: true, mode: 0o750 });
      const name = `${crypto.randomUUID()}.${type.ext}`;
      await writeFile(path.join(uploadDir, name), req.file.buffer, { flag: 'wx', mode: 0o640 });
      res.status(201).json({ url: `/uploads/${name}` });
    });
    const uploadErrors: express.ErrorRequestHandler = (error, _req, res, next) => {
      if (error instanceof multer.MulterError) {
        res.sendStatus(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
        return;
      }
      next(error);
    };
    app.use('/api/uploads', uploadErrors);
  }
  if (options.staticDir) {
    const staticDir = path.resolve(options.staticDir);
    app.use(express.static(staticDir, { index: false }));
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/uploads/') && !path.extname(req.path) && req.accepts('html')) {
        res.sendFile(path.join(staticDir, 'index.html'));
        return;
      }
      next();
    });
  }
  return app;
}
