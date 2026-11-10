import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import session from 'express-session';
import request from 'supertest';
import { createApp } from './app.js';

test('the secondary domain redirects and SPA routes serve the app without masking missing APIs', async () => {
  const staticDir = await mkdtemp(join(tmpdir(), 'fabric-static-test-'));
  try {
    await writeFile(join(staticDir, 'index.html'), '<html>Fabric app</html>');
    const app = createApp({
      password: 'a long test password', sessionSecret: 'a test secret with at least 32 characters',
      store: new session.MemoryStore(), allowedOrigins: ['https://fabric-actions.therapy-berlin.com'],
      secureCookies: false, staticDir, canonicalHost: 'fabric-actions.therapy-berlin.com', redirectHost: 'fabric-actions.art',
    });
    const redirect = await request(app).get('/admin?x=1').set('Host', 'fabric-actions.art').expect(308);
    assert.equal(redirect.headers.location, 'https://fabric-actions.therapy-berlin.com/admin?x=1');
    const page = await request(app).get('/admin/events').set('Host', 'fabric-actions.therapy-berlin.com').set('Accept', 'text/html').expect(200);
    assert.match(page.text, /Fabric app/);
    assert.match(page.headers['content-security-policy'], /script-src 'self' https:\/\/www\.googletagmanager\.com/);
    await request(app).get('/api/missing').set('Accept', 'text/html').expect(404);
  } finally {
    await rm(staticDir, { recursive: true, force: true });
  }
});
