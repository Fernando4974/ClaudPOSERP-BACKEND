import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Sales (e2e)', () => {
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

  it('/sales/get-all (GET) should respond without server error', async () => {
    const res = await request(app.getHttpServer()).get('/sales/get-all');
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });

  it('/sales/create (POST) should respond without server error', async () => {
    const res = await request(app.getHttpServer())
      .post('/sales/create')
      .send({ total: 100, iva: 0, status: 'EFECTIVO', items: [] });
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });
});
