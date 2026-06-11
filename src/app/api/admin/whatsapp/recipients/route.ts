import { proxyAdminWhatsapp } from "../_proxy";

export async function PUT(req: Request) {
  return proxyAdminWhatsapp(req, "recipients");
}
