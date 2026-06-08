import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;

  try {
    const res = await fetch(`${apiUrl}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });
    
    if (!res.ok) {
      return NextResponse.json({ message: "Erro ao buscar dashboard." }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Erro de conexão com o backend." }, { status: 500 });
  }
}
