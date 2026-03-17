import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) should respond without server error', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'e2e_test@example.com',
      password: 'Test1234!',
      name: 'E2E',
    });
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });

  it('/auth/login (POST) should respond without server error', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'no-exist@example.com', password: 'nope' });
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });
});
