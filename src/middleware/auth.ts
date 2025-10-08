import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export type AuthenticatedUser = {
  id: number;
  cargo: string;
};

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  const token = authHeader.substring("Bearer ".length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser & { iat: number; exp: number };
    (req as Request & { user?: AuthenticatedUser }).user = { id: decoded.id, cargo: decoded.cargo };
    next();
  } catch (_err) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as Request & { user?: AuthenticatedUser }).user;
  if (!user) {
    return res.status(401).json({ erro: "Não autenticado." });
  }
  if (user.cargo !== "Admin") {
    return res.status(403).json({ erro: "Permissão negada: requer cargo Admin." });
  }
  next();
}


