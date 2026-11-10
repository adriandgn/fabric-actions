import { test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import session from 'express-session';
import request from 'supertest';
import { createApp } from './app.js';

test('content is publicly readable and writes require an authorized valid request', async () => {
  const pool = new pg.Pool();
  const origin = 'https://example.test';
  const options = {
    password: 'a long test password',
    sessionSecret: 'a test secret with at least 32 characters',
    store: new session.MemoryStore(),
    allowedOrigins: [origin],
    secureCookies: false,
    pool,
  };
  const app = createApp(options);
  const agent = request.agent(app);
  try {
    await request(app).get('/api/health').expect(200);
    const seeded = await request(app).get('/api/content/artworks').expect(200);
    assert.equal(seeded.body.length, 5);
    await request(app).post('/api/content/events').set('Origin', origin).send({ title: 'Unauthorized' }).expect(401);
    await agent.post('/api/session/login').set('Origin', origin).send({ password: options.password }).expect(204);
    await agent.post('/api/content/events').set('Origin', origin).send({ title: '', unexpected: 'x' }).expect(400);
    const created = await agent.post('/api/content/events').set('Origin', origin)
      .send({ title: 'New event', exhibition_group: 'latest', position: 3 }).expect(201);
    assert.equal(created.body.title, 'New event');
    const id = created.body.id;
    const updated = await agent.put(`/api/content/events/${id}`).set('Origin', origin)
      .send({ title: 'Updated event', exhibition_group: 'latest', position: 3 }).expect(200);
    assert.equal(updated.body.title, 'Updated event');
    await agent.delete(`/api/content/events/${id}`).set('Origin', origin).expect(204);
    await agent.delete(`/api/content/events/${id}`).set('Origin', origin).expect(404);
    await agent.post('/api/content/events').set('Origin', origin)
      .send({ title: 'Invalid date', event_date: '2025-99-99' }).expect(400);
    for (const [collection, payload] of [
      ['artworks', { title: 'Piece', description: 'Description', image_url: '/img/studio-1.png', position: 4 }],
      ['urban_interventions', { title: 'Intervention', date: 'JUNE 1', image_url: '/img/studio-1.png', position: 4 }],
      ['event_posts', { title: 'Post', content: '<p>Content</p>', position: 4 }],
    ] as const) {
      const item = await agent.post(`/api/content/${collection}`).set('Origin', origin).send(payload).expect(201);
      const changed = await agent.put(`/api/content/${collection}/${item.body.id}`).set('Origin', origin)
        .send({ ...payload, title: 'Changed' }).expect(200);
      assert.equal(changed.body.title, 'Changed');
      await agent.delete(`/api/content/${collection}/${item.body.id}`).set('Origin', origin).expect(204);
    }
    const info = { last_exhibition: 'Last', header_label: 'Berlin', next_exhibition: 'Next', next_exhibition_date: 'July', next_exhibition_address: 'Berlin' };
    await agent.put('/api/content/exhibition_info/1').set('Origin', origin).send(info).expect(200);
    const fetchedInfo = await request(app).get('/api/content/exhibition_info').expect(200);
    assert.equal(fetchedInfo.body[0].last_exhibition, 'Last');
    await agent.delete('/api/content/exhibition_info/1').set('Origin', origin).expect(405);
    await request(app).get('/api/content/user_sessions').expect(404);
  } finally {
    await pool.end();
  }
});
