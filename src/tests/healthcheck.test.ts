import request from 'supertest';
import { app } from '../app';

describe('Rota GET /', () => {
  it('Deve retornar status 200 e um objeto JSON com status ok', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});