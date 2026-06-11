import { proxyAdminWhatsapp } from "../../_proxy";

export async function GET(req: Request, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  return proxyAdminWhatsapp(req, `chat/${phone}`);
}

export async function POST(req: Request, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  return proxyAdminWhatsapp(req, `chat/${phone}`);
}
