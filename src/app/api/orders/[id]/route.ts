import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  try {
    const res = await fetch(`${apiUrl}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Next.js API Orders] Error fetching order:", error);
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
