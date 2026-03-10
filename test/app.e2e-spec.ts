import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  let prisma: PrismaService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService)
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  it('should create a root node', async () => {
    const res = await request(app.getHttpServer())
      .post('/tree')
      .send({ label: 'root' })
      .expect(201)

    expect(res.body.label).toBe('root')
    expect(res.body.children).toEqual(undefined)
  })

  it('should create a child node', async () => {
    const root = await request(app.getHttpServer())
      .post('/tree')
      .send({ label: 'parent' })

    const child = await request(app.getHttpServer())
      .post('/tree')
      .send({
        label: 'child',
        parentId: root.body.id
      })
      .expect(201)

    expect(child.body.parentId).toBe(root.body.id)
  })

  it('should return a nested tree', async () => {

    const res = await request(app.getHttpServer())
      .get('/tree')
      .expect(200)

    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should reject invalid parentId', async () => {
    await request(app.getHttpServer())
      .post('/tree')
      .send({
        label: 'invalid',
        parentId: 9999
      })
      .expect(404)
  })
});
