import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import WatchHistory from '../src/models/WatchHistory.js';
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

async function registerAndLogin() {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'profile@test.com', password: '123456', username: 'tester' });

  return { token: res.body.token, activeProfileId: res.body.user.activeProfileId };
}

describe('POST /api/user/profile', () => {
  it('exige autenticacao', async () => {
    const res = await request(app).post('/api/user/profile').send({ name: 'Novo perfil' });
    expect(res.status).toBe(401);
  });

  it('cria um novo perfil', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .post('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Criancas' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Criancas');
  });

  it('rejeita perfil sem nome', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .post('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/user/profile', () => {
  it('retorna o perfil ativo do token', async () => {
    const { token, activeProfileId } = await registerAndLogin();

    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(activeProfileId);
  });

  it('retorna 403 quando o header X-Profile-Id nao pertence a conta', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Profile-Id', '000000000000000000000000');

    expect(res.status).toBe(403);
  });

  it('retorna 404 (nao quebra com 500) se o perfil do token nao existir mais', async () => {
    const res = await registerAndLogin();
    await User.updateOne({}, { $set: { profiles: [] } });

    const profileRes = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${res.token}`);

    expect(profileRes.status).toBe(404);
  });
});

describe('DELETE /api/user/profile/:profileId', () => {
  it('remove um perfil adicional', async () => {
    const { token } = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Criancas' });

    const res = await request(app)
      .delete(`/api/user/profile/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.deletedProfileId).toBe(createRes.body._id);

    const user = await User.findOne({ email: 'profile@test.com' });
    expect(user.profiles).toHaveLength(1);
  });

  it('nao permite excluir o unico perfil da conta', async () => {
    const { token, activeProfileId } = await registerAndLogin();

    const res = await request(app)
      .delete(`/api/user/profile/${activeProfileId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('retorna 404 para perfil inexistente', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .delete('/api/user/profile/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('apaga o historico/lista associados ao perfil removido', async () => {
    const { token } = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Criancas' });

    const content = await Content.create({ title: 'Filme Y', category: 'filmes' });

    await request(app)
      .post('/api/user/watchhistory')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Profile-Id', createRes.body._id)
      .send({ contentId: content._id, progress: 50 });

    await request(app)
      .delete(`/api/user/profile/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    const remainingHistory = await WatchHistory.find({ profileId: createRes.body._id });
    expect(remainingHistory).toHaveLength(0);
  });
});
