import { test } from 'node:test';
import assert from 'node:assert/strict';
import session from 'express-session';
import request from 'supertest';
import { createApp } from './app.js';

test('newsletter validates input and sends the Brevo key only to the server-side provider', async () => {
  let sent: RequestInit | undefined;
  const app = createApp({
    password: 'a long test password', sessionSecret: 'a test secret with at least 32 characters',
    store: new session.MemoryStore(), allowedOrigins: ['https://example.test'], secureCookies: false,
    newsletter: { apiKey: 'server-only-key', listId: 42, fetch: async (_url, init) => {
      sent = init;
      return new Response('{}', { status: 201 });
    } },
  });
  await request(app).post('/api/newsletter').set('Origin', 'https://example.test').send({ email: 'invalid' }).expect(400);
  const response = await request(app).post('/api/newsletter').set('Origin', 'https://example.test')
    .send({ email: 'person@example.com' }).expect(204);
  assert.equal((sent?.headers as Record<string, string>)['api-key'], 'server-only-key');
  assert.deepEqual(JSON.parse(String(sent?.body)), { email: 'person@example.com', listIds: [42], updateEnabled: true });
  assert.ok(!JSON.stringify(response.headers).includes('server-only-key'));
});
