import { Router } from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();
const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const colaborador = await prisma.colaborador.findUnique({ where: { email } });
    if (!colaborador) return res.status(401).json({ erro: "Email ou senha inválidos." });

    const ok = await bcrypt.compare(senha, colaborador.senha);
    if (!ok) return res.status(401).json({ erro: "Email ou senha inválidos." });

    const token = jwt.sign({ id: colaborador.id, cargo: colaborador.cargo }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao autenticar usuário." });
  }
});

export default router;
