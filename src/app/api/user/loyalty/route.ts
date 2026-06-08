import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 401 });
  }

  const token = session.accessToken;

  try {
    const res = await fetch(`${apiUrl}/loyalty/user/stamps`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
