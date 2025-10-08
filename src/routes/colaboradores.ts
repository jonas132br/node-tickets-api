import { Router } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

const cargoEnum = z.enum(["Admin", "Atendente"]);
const createColabSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  cargo: cargoEnum,
});
const updateColabSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  cargo: cargoEnum.optional(),
});

// criar colaborador
router.post("/", authenticateJWT, async (req, res) => {
  const parse = createColabSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ erro: "Validação falhou", detalhes: parse.error.flatten() });
  const { nome, email, senha, cargo } = parse.data;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const colaborador = await prisma.colaborador.create({
      data: { nome, email, senha: senhaHash, cargo },
      select: { id: true, nome: true, email: true, cargo: true },
    });
    res.status(201).json(colaborador);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar colaborador." });
  }
});

// listar colaboradores
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const colaboradores = await prisma.colaborador.findMany({ select: { id: true, nome: true, email: true, cargo: true } });
    res.json(colaboradores);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar colaboradores." });
  }
});

router.get("/:id", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  try {
    const colab = await prisma.colaborador.findUnique({ where: { id }, select: { id: true, nome: true, email: true, cargo: true } });
    if (!colab) return res.status(404).json({ erro: "Colaborador não encontrado" });
    res.json(colab);
  } catch (_err) {
    res.status(500).json({ erro: "Erro ao buscar colaborador." });
  }
});

router.put("/:id", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  const parse = updateColabSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ erro: "Validação falhou", detalhes: parse.error.flatten() });
  const data = { ...parse.data } as any;
  if (data.senha) data.senha = await bcrypt.hash(data.senha, 10);
  try {
    const colab = await prisma.colaborador.update({ where: { id }, data, select: { id: true, nome: true, email: true, cargo: true } });
    res.json(colab);
  } catch (_err) {
    return res.status(404).json({ erro: "Colaborador não encontrado" });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  try {
    await prisma.colaborador.delete({ where: { id } });
    res.status(204).send();
  } catch (_err) {
    return res.status(404).json({ erro: "Colaborador não encontrado" });
  }
});

export default router;
