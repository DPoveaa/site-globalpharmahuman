import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const REQUIRED_PERMISSION = "manage_whatsapp";

function buildBackendPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function proxyAdminWhatsapp(req: Request, path: string) {
  const session = await getServerSession(authOptions);
  const canManage =
    session?.user?.role === "ADMIN" ||
    (session?.user?.role === "EMPLOYEE" && session.user.permissions?.includes(REQUIRED_PERMISSION));

  if (!session?.accessToken || !canManage) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const requestUrl = new URL(req.url);
  const target = `${apiUrl}/admin/whatsapp/${buildBackendPath(path)}${requestUrl.search}`;
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();
  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`
  };

  if (body) {
    headers["Content-Type"] = req.headers.get("content-type") || "application/json";
  }

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store"
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 404) {
      return NextResponse.json(
        {
          message: data.message || "Rota do backend não encontrada. Reinicie o backend para carregar as rotas de WhatsApp."
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Erro de conexão com o backend. Verifique se o backend está rodando na porta configurada." },
      { status: 502 }
    );
  }
}
