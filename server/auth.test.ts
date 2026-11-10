import { test } from 'node:test';
import assert from 'node:assert/strict';
import session from 'express-session';
import request from 'supertest';
import { createApp } from './app.js';

const origin = 'https://fabric-actions.therapy-berlin.com';
const app = createApp({
  password: 'a long test password',
  sessionSecret: 'a test secret with at least 32 characters',
  store: new session.MemoryStore(),
  allowedOrigins: [origin],
  secureCookies: false,
});

test('login requires a trusted origin and correct password', async () => {
  await request(app).post('/api/session/login').send({ password: 'a long test password' }).expect(403);
  await request(app).post('/api/session/login').set('Origin', origin).send({ password: 'wrong' }).expect(401);
  await request(app).get('/api/admin/ping').expect(401);
});

test('a session permits admin access and logout revokes it', async () => {
  const agent = request.agent(app);
  const login = await agent.post('/api/session/login').set('Origin', origin).send({ password: 'a long test password' }).expect(204);
  assert.match(String(login.headers['set-cookie']), /HttpOnly/i);
  assert.match(String(login.headers['set-cookie']), /SameSite=Lax/i);
  await agent.get('/api/admin/ping').expect(200);
  await agent.post('/api/session/logout').set('Origin', 'https://attacker.example').expect(403);
  await agent.post('/api/session/logout').set('Origin', origin).expect(204);
  await agent.get('/api/admin/ping').expect(401);
});

test('production cookies are secure behind a trusted TLS proxy', async () => {
  const productionApp = createApp({
    password: 'a long test password', sessionSecret: 'a test secret with at least 32 characters',
    store: new session.MemoryStore(), allowedOrigins: [origin], secureCookies: true,
  });
  const response = await request(productionApp).post('/api/session/login').set('Origin', origin)
    .set('X-Forwarded-Proto', 'https').send({ password: 'a long test password' }).expect(204);
  assert.match(String(response.headers['set-cookie']), /; Secure/i);
});

test('repeated failed logins are rate limited', async () => {
  const limitedApp = createApp({
    password: 'a long test password', sessionSecret: 'a test secret with at least 32 characters',
    store: new session.MemoryStore(), allowedOrigins: [origin], secureCookies: false,
  });
  for (let attempt = 0; attempt < 10; attempt++) {
    await request(limitedApp).post('/api/session/login').set('Origin', origin).send({ password: 'wrong' }).expect(401);
  }
  await request(limitedApp).post('/api/session/login').set('Origin', origin).send({ password: 'wrong' }).expect(429);
});
