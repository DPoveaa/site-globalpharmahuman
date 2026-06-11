import fs from "fs";
import path from "path";
import type { Whatsapp } from "@wppconnect-team/wppconnect";
import { prisma } from "../lib/prisma";

type WppStatus = "DISCONNECTED" | "STARTING" | "QRCODE" | "CONNECTED" | "ERROR";

type Recipient = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
};

type ChatMessage = {
  id: string;
  fromMe: boolean;
  body: string;
  timestamp: number;
  sender?: string;
};

const SETTINGS_KEYS = {
  recipients: "ADMIN_WPP_NOTIFICATION_RECIPIENTS",
  session: "ADMIN_WPP_SESSION_NAME"
};
const MAX_MESSAGE_LENGTH = 1000;
const CONNECTED_STATUSES = new Set(["isLogged", "inChat", "qrReadSuccess"]);
const DISCONNECTED_STATUSES = new Set([
  "notLogged",
  "browserClose",
  "serverClose",
  "autocloseCalled",
  "disconnectedMobile",
  "desconnectedMobile",
  "phoneNotConnected"
]);

let client: Whatsapp | null = null;
let status: WppStatus = "DISCONNECTED";
let latestQrCode: string | null = null;
let latestError: string | null = null;
let startingPromise: Promise<void> | null = null;

function getDb() {
  return prisma as any;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function toChatId(phone: string) {
  return `${normalizePhone(phone)}@c.us`;
}

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function getSetting(key: string) {
  try {
    const setting = await getDb().setting.findUnique({ where: { key } });
    return setting?.value || "";
  } catch (error: any) {
    latestError = error?.message || "Erro ao ler configurações do WhatsApp.";
    return "";
  }
}

async function setSetting(key: string, value: string) {
  try {
    return await getDb().setting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    });
  } catch (error: any) {
    throw new Error(error?.message || "Erro ao salvar configurações do WhatsApp.");
  }
}

function normalizeMessage(message: any): ChatMessage {
  return {
    id: String(message.id?._serialized || message.id || `${message.t || message.timestamp}-${message.body || ""}`),
    fromMe: Boolean(message.fromMe),
    body: String(message.body || message.caption || message.content || ""),
    timestamp: Number(message.t || message.timestamp || Date.now() / 1000),
    sender: String(message.sender?.pushname || message.notifyName || "")
  };
}

function assertValidPhone(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
    throw new Error("Número de WhatsApp inválido.");
  }
  return normalizedPhone;
}

async function loadWppConnect() {
  try {
    const req = eval("require") as NodeRequire;
    return req("@wppconnect-team/wppconnect") as typeof import("@wppconnect-team/wppconnect");
  } catch (error: any) {
    throw new Error(error?.message || "Dependência @wppconnect-team/wppconnect não instalada ou indisponível.");
  }
}

export async function getAdminWhatsappRecipients(): Promise<Recipient[]> {
  const raw = await getSetting(SETTINGS_KEYS.recipients);
  const recipients = safeJsonParse<Recipient[]>(raw, []);
  return recipients
    .map((recipient) => ({
      id: String(recipient.id || ""),
      name: String(recipient.name || "").trim(),
      phone: normalizePhone(String(recipient.phone || "")),
      active: recipient.active !== false
    }))
    .filter((recipient) => recipient.name && recipient.phone);
}

export async function saveAdminWhatsappRecipients(recipients: Recipient[]) {
  const uniquePhones = new Set<string>();
  const normalized = recipients
    .map((recipient) => ({
      id: recipient.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: recipient.name.trim(),
      phone: normalizePhone(recipient.phone),
      active: recipient.active !== false
    }))
    .filter((recipient) => {
      if (!recipient.name || recipient.phone.length < 10 || recipient.phone.length > 15) return false;
      if (uniquePhones.has(recipient.phone)) return false;
      uniquePhones.add(recipient.phone);
      return true;
    })
    .slice(0, 10);

  await setSetting(SETTINGS_KEYS.recipients, JSON.stringify(normalized));
  return normalized;
}

export async function getAdminWhatsappStatus() {
  const isConnected = client?.isConnected ? await Promise.resolve(client.isConnected()).catch(() => false) : false;
  if (client && isConnected) status = "CONNECTED";
  if (client && !isConnected && status === "CONNECTED") status = "DISCONNECTED";

  return {
    status,
    qrCode: latestQrCode,
    error: latestError,
    recipients: await getAdminWhatsappRecipients()
  };
}

export async function startAdminWhatsappSession() {
  if (startingPromise) return startingPromise;
  if (client && status === "CONNECTED") return;

  status = "STARTING";
  latestQrCode = null;
  latestError = null;

  startingPromise = (async () => {
    try {
      const wppconnect = await loadWppConnect();
      const session = (await getSetting(SETTINGS_KEYS.session)) || "globalpharma-admin";

      client = await wppconnect.create({
        session,
        headless: true,
        autoClose: 0,
        waitForLogin: false,
        logQR: false,
        disableWelcome: true,
        updatesLog: false,
        folderNameToken: path.resolve(process.cwd(), "tokens"),
        browserArgs: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ],
        catchQR: (base64Qr) => {
          latestQrCode = base64Qr.startsWith("data:image") ? base64Qr : `data:image/png;base64,${base64Qr}`;
          status = "QRCODE";
        },
        statusFind: (sessionStatus) => {
          const normalizedStatus = String(sessionStatus);
          if (CONNECTED_STATUSES.has(normalizedStatus)) {
            status = "CONNECTED";
            latestQrCode = null;
            latestError = null;
          }
          if (DISCONNECTED_STATUSES.has(normalizedStatus)) {
            status = "DISCONNECTED";
            latestQrCode = null;
          }
          if (normalizedStatus === "qrReadError" || normalizedStatus === "qrReadFail") {
            status = "ERROR";
            latestError = "Erro ao ler QR Code. Gere um novo QR e tente novamente.";
          }
        }
      });

      const isConnected = client.isConnected ? await Promise.resolve(client.isConnected()).catch(() => false) : false;
      status = isConnected ? "CONNECTED" : latestQrCode ? "QRCODE" : "STARTING";
      if (isConnected) latestQrCode = null;
    } catch (error: any) {
      status = "ERROR";
      latestError = error?.message || "Erro ao iniciar WhatsApp.";
      client = null;
      latestQrCode = null;
    } finally {
      startingPromise = null;
    }
  })();

  return startingPromise;
}

export async function stopAdminWhatsappSession() {
  if (client?.close) await client.close().catch(() => undefined);
  client = null;
  latestQrCode = null;
  latestError = null;
  status = "DISCONNECTED";
}

export function formatOrderNotification(order: any, address: any, paymentMethod: string) {
  const createdAt = new Date(order.createdAt || Date.now()).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });

  const products = (order.items || [])
    .map((item: any) => {
      const productName = item.product?.name || item.productName || item.productId;
      return `- ${item.quantity}x ${productName} - R$ ${Number(item.subtotal).toFixed(2).replace(".", ",")}`;
    })
    .join("\n");

  const delivery = address
    ? [
        `${address.street}, ${address.number}`,
        address.complement ? `Compl.: ${address.complement}` : "",
        `${address.district} - ${address.city}/${address.state}`,
        `CEP: ${address.zipCode}`,
        address.reference ? `Ref.: ${address.reference}` : ""
      ].filter(Boolean).join("\n")
    : "Endereço não informado.";

  return [
    "*Novo pedido recebido!*",
    "",
    `*Pedido:* #${String(order.id).slice(-8).toUpperCase()}`,
    `*Data:* ${createdAt}`,
    `*Pagamento:* ${paymentMethod || "Não informado"}`,
    `*Total:* R$ ${Number(order.total || 0).toFixed(2).replace(".", ",")}`,
    "",
    "*Cliente*",
    `*Nome:* ${order.user?.name || "Não informado"}`,
    `*E-mail:* ${order.user?.email || "Não informado"}`,
    `*WhatsApp:* ${order.whatsappContact || order.user?.phone || "Não informado"}`,
    "",
    "*Produtos*",
    products || "Nenhum item informado.",
    "",
    "*Entrega*",
    delivery,
    "",
    "Acompanhe e responda pelo painel administrativo."
  ].join("\n");
}

export async function sendAdminWhatsappMessage(phone: string, message: string) {
  if (!client || status !== "CONNECTED") {
    throw new Error(latestError || "WhatsApp administrativo não conectado.");
  }

  const normalizedPhone = assertValidPhone(phone);
  const normalizedMessage = message.trim();

  if (!normalizedMessage || normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    throw new Error("Mensagem inválida.");
  }

  return client.sendText(toChatId(normalizedPhone), normalizedMessage);
}

export async function notifyAdminWhatsappNewOrder(order: any, address: any, paymentMethod: string) {
  const recipients = (await getAdminWhatsappRecipients()).filter((recipient) => recipient.active);
  if (!recipients.length) return { sent: 0, errors: [] as string[] };

  const message = formatOrderNotification(order, address, paymentMethod);
  const errors: string[] = [];
  let sent = 0;

  for (const recipient of recipients) {
    try {
      await sendAdminWhatsappMessage(recipient.phone, message);
      sent += 1;
    } catch (error: any) {
      errors.push(`${recipient.name}: ${error?.message || "erro desconhecido"}`);
    }
  }

  return { sent, errors };
}

export async function sendAdminWhatsappTestMessage(phone: string) {
  const message = [
    "*Teste de notificação Global Pharma Human*",
    "",
    "Seu WhatsApp administrativo está conectado e pronto para receber alertas de novos pedidos."
  ].join("\n");

  await sendAdminWhatsappMessage(phone, message);
}

export async function getAdminWhatsappChat(phone: string) {
  if (!client || status !== "CONNECTED") {
    throw new Error("WhatsApp administrativo não conectado.");
  }

  const activeClient = client;
  const chatId = toChatId(assertValidPhone(phone));
  const messages =
    await activeClient.getMessages(chatId, { count: 50 }).catch(async () =>
      activeClient.getAllMessagesInChat(chatId, true, false).catch(() => [])
    );

  return messages.slice(-50).map(normalizeMessage);
}

export async function sendAdminWhatsappChatMessage(phone: string, message: string) {
  await sendAdminWhatsappMessage(phone, message);
  return getAdminWhatsappChat(phone).catch(() => []);
}

export async function initializeAdminWhatsapp(): Promise<void> {
  try {
    const recipients = await getAdminWhatsappRecipients();
    const session = (await getSetting(SETTINGS_KEYS.session)) || "globalpharma-admin";
    const tokenPath = path.resolve(process.cwd(), "tokens", session);
    const hasToken = fs.existsSync(tokenPath);
    const hasRecipients = recipients.length > 0;

    if (hasToken || hasRecipients) {
      console.log("[WhatsApp] Configuração ou token de sessão existente. Iniciando conexão automática...");
      // Inicia em background
      startAdminWhatsappSession();
    } else {
      console.log("[WhatsApp] Nenhuma configuração de WhatsApp ativa encontrada. Aguardando conexão manual.");
    }
  } catch (error) {
    console.error("[WhatsApp] Erro na inicialização automática do WhatsApp:", error);
  }
}
