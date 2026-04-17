import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt";

type UserRole = "ADMIN" | "CUSTOMER";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
        email: string;
      };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth || req.auth.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado." });
  }
  return next();
}

