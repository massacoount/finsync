import request from 'supertest';
import app from '../App';

describe('GET /nonexistent', () => {
  it('should return 404 with JSON response', async () => {
    const res = await request(app).get('/nonexistent').set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 404 with HTML response', async () => {
    const res = await request(app).get('/nonexistent').set('Accept', 'text/html');
    expect(res.status).toBe(404);
    expect(res.text).toContain('404 - Not Found');
  });
});
