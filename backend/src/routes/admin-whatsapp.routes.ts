import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middlewares/auth";
import {
  getAdminWhatsappChat,
  getAdminWhatsappRecipients,
  getAdminWhatsappStatus,
  saveAdminWhatsappRecipients,
  sendAdminWhatsappChatMessage,
  sendAdminWhatsappTestMessage,
  startAdminWhatsappSession,
  stopAdminWhatsappSession
} from "../services/admin-whatsapp.service";

const router = Router();
const db = prisma as any;
const REQUIRED_PERMISSION = "manage_whatsapp";
const phoneSchema = z.string().trim().refine((phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}, "Número inválido.");

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function asyncRoute(handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

async function ensureRegisteredRecipient(phone: string) {
  const normalized = normalizePhone(phone);
  const recipients = await getAdminWhatsappRecipients();
  return recipients.some((recipient) => recipient.phone === normalized);
}

router.use(requireAuth);

router.use(asyncRoute(async (req, res, next) => {
  if (req.auth?.role === "ADMIN") return next();

  const user = await db.user.findUnique({
    where: { id: req.auth!.userId },
    select: { permissions: true }
  });

  if (Array.isArray(user?.permissions) && user.permissions.includes(REQUIRED_PERMISSION)) {
    return next();
  }

  return res.status(403).json({ message: "Sem permissão para gerenciar WhatsApp." });
}));

router.get("/status", asyncRoute(async (_req, res) => {
  return res.json(await getAdminWhatsappStatus());
}));

router.post("/start", asyncRoute(async (_req, res) => {
  await startAdminWhatsappSession();
  return res.json(await getAdminWhatsappStatus());
}));

router.post("/stop", asyncRoute(async (_req, res) => {
  await stopAdminWhatsappSession();
  return res.json(await getAdminWhatsappStatus());
}));

router.put("/recipients", asyncRoute(async (req, res) => {
  const parsed = z.object({
    recipients: z.array(z.object({
      id: z.string().optional(),
      name: z.string().trim().min(1).max(80),
      phone: phoneSchema,
      active: z.boolean().default(true)
    })).max(10)
  }).safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ message: "Destinatários inválidos." });

  const recipients = await saveAdminWhatsappRecipients(
    parsed.data.recipients.map((recipient) => ({
      id: recipient.id || "",
      name: recipient.name,
      phone: recipient.phone,
      active: recipient.active !== false
    }))
  );
  return res.json({ recipients });
}));

router.post("/test", asyncRoute(async (req, res) => {
  const parsed = z.object({ phone: phoneSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Número inválido." });
  if (!await ensureRegisteredRecipient(parsed.data.phone)) {
    return res.status(403).json({ message: "Número não cadastrado para notificações." });
  }

  await sendAdminWhatsappTestMessage(parsed.data.phone);
  return res.json({ ok: true });
}));

router.get("/chat/:phone", asyncRoute(async (req, res) => {
  const parsedPhone = phoneSchema.safeParse(req.params.phone);
  if (!parsedPhone.success) return res.status(400).json({ message: "Número inválido." });
  if (!await ensureRegisteredRecipient(parsedPhone.data)) {
    return res.status(403).json({ message: "Número não cadastrado para monitoramento." });
  }

  const messages = await getAdminWhatsappChat(parsedPhone.data);
  return res.json({ messages });
}));

router.post("/chat/:phone", asyncRoute(async (req, res) => {
  const parsed = z.object({ message: z.string().trim().min(1).max(1000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Mensagem inválida." });

  const parsedPhone = phoneSchema.safeParse(req.params.phone);
  if (!parsedPhone.success) return res.status(400).json({ message: "Número inválido." });
  if (!await ensureRegisteredRecipient(parsedPhone.data)) {
    return res.status(403).json({ message: "Número não cadastrado para monitoramento." });
  }

  const messages = await sendAdminWhatsappChatMessage(parsedPhone.data, parsed.data.message);
  return res.json({ ok: true, messages });
}));

router.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const message = error?.message || "Erro interno no WhatsApp administrativo.";
  return res.status(500).json({ message });
});

export default router;
