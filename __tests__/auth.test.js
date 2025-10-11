const fs = require('fs');
const path = require('path');
const request = require('supertest');

describe('Authentication API', () => {
  const tmpDataFile = path.join(__dirname, 'test-users.json');
  let originalEnv;
  let app;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.JWT_SECRET = 'test-secret';
    process.env.USER_DATA_FILE = tmpDataFile;
  });

  beforeEach(() => {
    if (fs.existsSync(tmpDataFile)) {
      fs.unlinkSync(tmpDataFile);
    }

    jest.resetModules();
    // eslint-disable-next-line global-require
    app = require('../index');
  });

  afterAll(() => {
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);

    if (fs.existsSync(tmpDataFile)) {
      fs.unlinkSync(tmpDataFile);
    }
  });

  it('registers a new user', async () => {
    const response = await request(app).post('/auth/register').send({
      username: 'alice',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('prevents duplicate usernames', async () => {
    await request(app).post('/auth/register').send({
      username: 'bob',
      password: 'password123',
    });

    const response = await request(app).post('/auth/register').send({
      username: 'bob',
      password: 'password123',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ message: 'Username already exists' });
  });

  it('logs in with valid credentials and returns a token', async () => {
    await request(app).post('/auth/register').send({
      username: 'carol',
      password: 'password123',
    });

    const response = await request(app).post('/auth/login').send({
      username: 'carol',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.expiresIn).toBeDefined();
  });

  it('rejects invalid credentials', async () => {
    await request(app).post('/auth/register').send({
      username: 'dave',
      password: 'password123',
    });

    const response = await request(app).post('/auth/login').send({
      username: 'dave',
      password: 'wrongpass',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });
});
