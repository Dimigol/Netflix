import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
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

describe('POST /api/auth/register', () => {
  it('cria um usuario e retorna token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: '123456', username: 'tester' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('user@test.com');
    expect(res.body.user.profiles).toHaveLength(1);
  });

  it('rejeita email invalido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nao-e-email', password: '123456', username: 'tester' });

    expect(res.status).toBe(400);
  });

  it('rejeita senha curta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user2@test.com', password: '123', username: 'tester' });

    expect(res.status).toBe(400);
  });

  it('rejeita email duplicado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: '123456', username: 'a' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: '123456', username: 'b' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already in use');
  });
});

describe('POST /api/auth/login', () => {
  it('autentica com credenciais corretas', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test.com', password: '123456', username: 'tester' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('rejeita senha incorreta', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login2@test.com', password: '123456', username: 'tester' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login2@test.com', password: 'senhaerrada' });

    expect(res.status).toBe(401);
  });

  it('rejeita login sem senha', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com' });

    expect(res.status).toBe(400);
  });
});
