import { Router } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
import { authenticateJWT, requireAdmin } from "../middleware/auth";

const router = Router();

const prioridadeEnum = z.enum(["baixa", "media", "alta"]);

const ticketCreateSchema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  descricao: z.string().min(5, "Descrição deve ter ao menos 5 caracteres"),
  prioridade: prioridadeEnum,
  colaboradorId: z.number().int().positive(),
});

const ticketUpdateSchema = z.object({
  titulo: z.string().min(3).optional(),
  descricao: z.string().min(5).optional(),
  prioridade: prioridadeEnum.optional(),
  colaboradorId: z.number().int().positive().optional(),
});

// criar ticket
router.post("/", authenticateJWT, async (req, res) => {
  const parse = ticketCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ erro: "Validação falhou", detalhes: parse.error.flatten() });
  }
  const { titulo, descricao, prioridade, colaboradorId } = parse.data;

  try {
    const ticket = await prisma.ticket.create({
      data: {
        titulo,
        descricao,
        prioridade,
        colaborador: { connect: { id: colaboradorId } },
      },
    });
    res.status(201).json(ticket);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar ticket." });
  }
});

// listar tickets
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { colaborador: true }
    });
    res.json(tickets);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar tickets." });
  }
});

// obter por id
router.get("/:id", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id }, include: { colaborador: true } });
    if (!ticket) return res.status(404).json({ erro: "Ticket não encontrado" });
    res.json(ticket);
  } catch (_err) {
    res.status(500).json({ erro: "Erro ao buscar ticket." });
  }
});

// atualizar
router.put("/:id", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  const parse = ticketUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ erro: "Validação falhou", detalhes: parse.error.flatten() });
  }
  const { colaboradorId, ...rest } = parse.data;
  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...rest,
        ...(colaboradorId ? { colaborador: { connect: { id: colaboradorId } } } : {}),
      },
    });
    res.json(ticket);
  } catch (_err) {
    return res.status(404).json({ erro: "Ticket não encontrado" });
  }
});

// deletar (apenas Admin)
router.delete("/:id", authenticateJWT, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ erro: "ID inválido" });
  try {
    await prisma.ticket.delete({ where: { id } });
    res.status(204).send();
  } catch (_err) {
    return res.status(404).json({ erro: "Ticket não encontrado" });
  }
});

export default router;
