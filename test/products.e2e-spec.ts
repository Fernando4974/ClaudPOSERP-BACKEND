import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Products (e2e)', () => {
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

  it('/products/getAll (GET) should respond without server error', async () => {
    const res = await request(app.getHttpServer()).get('/products/getAll');
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });

  it('/products/number-key/:data (GET) should respond without server error', async () => {
    const res = await request(app.getHttpServer()).get(
      '/products/number-key/1',
    );
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });

  it('/products/:id (GET) should respond without server error', async () => {
    const res = await request(app.getHttpServer()).get(
      '/products/non-existent-id',
    );
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });
});
