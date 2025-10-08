import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/prisma';
import bcrypt from 'bcrypt';

describe('Auth', () => {
  const email = 'test@example.com';
  const senha = 'secret123';

  beforeAll(async () => {
    await prisma.colaborador.deleteMany({ where: { email } });
    const senhaHash = await bcrypt.hash(senha, 10);
    await prisma.colaborador.create({ data: { nome: 'Tester', email, senha: senhaHash, cargo: 'Admin' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve autenticar e retornar token JWT', async () => {
    const res = await request(app).post('/auth').send({ email, senha });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});


