import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import request from 'supertest';
import { createApp } from './app.js';

test('a PostgreSQL session survives a new app instance and logout revokes it', async () => {
  const pool = new pg.Pool();
  const PgStore = connectPgSimple(session);
  const store = new PgStore({ pool, tableName: 'user_sessions', pruneSessionInterval: false });
  const options = {
    password: 'a long test password',
    sessionSecret: 'a test secret with at least 32 characters',
    store,
    allowedOrigins: ['https://example.test'],
    secureCookies: false,
  };
  try {
    const login = await request(createApp(options)).post('/api/session/login')
      .set('Origin', 'https://example.test').send({ password: options.password }).expect(204);
    const cookie = login.headers['set-cookie'];
    assert.ok(cookie);
    const otherApp = createApp(options);
    await request(otherApp).get('/api/admin/ping').set('Cookie', cookie).expect(200);
    await request(otherApp).post('/api/session/logout').set('Cookie', cookie).set('Origin', 'https://example.test').expect(204);
    await request(otherApp).get('/api/admin/ping').set('Cookie', cookie).expect(401);
  } finally {
    await pool.end();
  }
});
