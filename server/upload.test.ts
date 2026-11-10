import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import session from 'express-session';
import request from 'supertest';
import { createApp } from './app.js';

test('only an administrator can upload a real, size-limited image that remains readable after restart', async () => {
  const uploadDir = await mkdtemp(join(tmpdir(), 'fabric-upload-test-'));
  const origin = 'https://example.test';
  const options = {
    password: 'a long test password', sessionSecret: 'a test secret with at least 32 characters',
    store: new session.MemoryStore(), allowedOrigins: [origin], secureCookies: false, uploadDir,
  };
  try {
    const app = createApp(options);
    const image = await readFile('public/img/studio-1.png');
    await request(app).post('/api/uploads').set('Origin', origin).attach('image', image, 'image.png').expect(401);
    const agent = request.agent(app);
    await agent.post('/api/session/login').set('Origin', origin).send({ password: options.password }).expect(204);
    await agent.post('/api/uploads').set('Origin', origin).attach('image', Buffer.from('not an image'), 'fake.png').expect(415);
    await agent.post('/api/uploads').set('Origin', origin).attach('image', Buffer.alloc(5 * 1024 * 1024 + 1), 'large.png').expect(413);
    const saved = await agent.post('/api/uploads').set('Origin', origin).attach('image', image, '../original.png').expect(201);
    assert.match(saved.body.url, /^\/uploads\/[a-f0-9-]+\.png$/);
    const fetched = await request(createApp(options)).get(saved.body.url).expect(200);
    assert.match(fetched.headers['content-type'], /^image\/png/);
    assert.deepEqual(fetched.body, image);
  } finally {
    await rm(uploadDir, { recursive: true, force: true });
  }
});
