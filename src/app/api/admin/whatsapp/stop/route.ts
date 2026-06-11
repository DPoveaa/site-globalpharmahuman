import { proxyAdminWhatsapp } from "../_proxy";

export async function POST(req: Request) {
  return proxyAdminWhatsapp(req, "stop");
}
