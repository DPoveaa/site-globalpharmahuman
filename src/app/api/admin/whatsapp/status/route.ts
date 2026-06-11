import { proxyAdminWhatsapp } from "../_proxy";

export async function GET(req: Request) {
  return proxyAdminWhatsapp(req, "status");
}
