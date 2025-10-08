import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/prisma';
import bcrypt from 'bcrypt';

describe('Tickets', () => {
  let token: string;
  let colaboradorId: number;

  beforeAll(async () => {
    const email = 'ticketer@example.com';
    const senha = 'secret123';
    await prisma.ticket.deleteMany();
    await prisma.colaborador.deleteMany({ where: { email } });
    const senhaHash = await bcrypt.hash(senha, 10);
    const user = await prisma.colaborador.create({ data: { nome: 'Ticketer', email, senha: senhaHash, cargo: 'Admin' } });
    colaboradorId = user.id;

    const auth = await request(app).post('/auth').send({ email, senha });
    token = auth.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('cria e lê um ticket', async () => {
    const create = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Bug', descricao: 'Algo quebrou', prioridade: 'alta', colaboradorId });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const get = await request(app).get(`/tickets/${id}`).set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body.titulo).toBe('Bug');
  });
});


