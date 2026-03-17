import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Common (e2e)', () => {
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

  it('/upload/image (POST) without file should return client error but not 5xx', async () => {
    const res = await request(app.getHttpServer()).post('/upload/image');
    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });
});
