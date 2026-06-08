import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const res = await fetch(`${apiUrl}/admin/orders/notifications-check`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no proxy de notificações:", error);
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
