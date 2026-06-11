import { proxyAdminWhatsapp } from "../_proxy";

async function proxy(req: Request, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  return proxyAdminWhatsapp(req, path.join("/"));
}

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params);
}

export async function POST(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params);
}

export async function PUT(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx.params);
}
