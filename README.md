API simples em Node.js + Express + TypeScript para gerenciamento de tickets, com PostgreSQL (Prisma), autenticação JWT, validação com Zod, testes com Jest e containerização com Docker.

## Rotas
- `POST /auth`: autentica com email/senha, retorna JWT
- `GET /tickets` (auth)
- `POST /tickets` (auth)
- `GET /tickets/:id` (auth)
- `PUT /tickets/:id` (auth)
- `DELETE /tickets/:id` (auth + Admin)
- `GET /colaboradores` (auth)
- `POST /colaboradores` (auth)
- `GET /colaboradores/:id` (auth)
- `PUT /colaboradores/:id` (auth)
- `DELETE /colaboradores/:id` (auth)

## Requisitos
- Node 20+
- PostgreSQL 14+

## Configuração (local)
1. Crie `.env` na raiz com:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tickets?schema=public"
JWT_SECRET="dev_secret_change_me"
```
2. Instale dependências:
```
npm ci
```
3. Gere client e rode migrações:
```
npx prisma generate
npx prisma migrate dev
```
4. Inicie em dev:
```
npm run dev
```

## Scripts
- `npm run dev`: iniciar em dev (ts-node)
- `npm run build`: compilar TypeScript
- `npm start`: executar build
- `npm test`: rodar testes

## Docker
Com Docker e docker-compose:
```
docker-compose up --build
```
API em `http://localhost:3000`. Migrações rodam no start (`migrate deploy`).

## Testes
Use um banco de teste separado (ex: `tickets_test`):
```
NODE_ENV=test DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tickets_test?schema=public npm test
```

## Segurança
- Senhas com `bcrypt`.
- JWT obrigatório; `Admin` pode excluir tickets.

## Decisões
- `zod` para validação com erros claros.
- Prisma para dados e migrações.
- Jest + supertest para endpoints principais.
