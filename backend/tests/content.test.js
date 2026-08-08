import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import Content from '../src/models/Content.js';
import { setupTestDb, teardownTestDb, clearTestDb } from './setup.js';

beforeAll(async () => {
  await setupTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

describe('GET /api/content', () => {
  it('lista conteudo cadastrado', async () => {
    await Content.create({ title: 'Filme Teste', category: 'filmes' });

    const res = await request(app).get('/api/content');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Filme Teste');
  });

  it('filtra por categoria', async () => {
    await Content.create({ title: 'Serie A', category: 'series' });
    await Content.create({ title: 'Filme B', category: 'filmes' });

    const res = await request(app).get('/api/content?category=series');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('series');
  });
});

describe('GET /api/content/:id', () => {
  it('retorna 400 para id invalido', async () => {
    const res = await request(app).get('/api/content/id-invalido');
    expect(res.status).toBe(400);
  });

  it('retorna 404 para conteudo inexistente', async () => {
    const missingId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/content/${missingId}`);
    expect(res.status).toBe(404);
  });

  it('retorna o conteudo normalizado', async () => {
    const content = await Content.create({ title: 'Filme X', category: 'filmes' });
    const res = await request(app).get(`/api/content/${content._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Filme X');
    expect(res.body.image).toBeTruthy();
    expect(res.body.youtubeUrl).toBeTruthy();
  });
});

describe('GET /api/content/search', () => {
  it('exige parametro de busca', async () => {
    const res = await request(app).get('/api/content/search');
    expect(res.status).toBe(400);
  });

  it('busca por titulo', async () => {
    await Content.create({ title: 'Aventura Espacial', category: 'filmes', description: 'uma jornada' });
    await Content.create({ title: 'Comedia Romantica', category: 'filmes', description: 'um romance' });

    const res = await request(app).get('/api/content/search?q=Espacial');

    expect(res.status).toBe(200);
    expect(res.body.some(item => item.title === 'Aventura Espacial')).toBe(true);
  });
});
