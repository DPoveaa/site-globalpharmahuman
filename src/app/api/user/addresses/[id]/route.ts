import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const res = await fetch(`${apiUrl}/user/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar endereço" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  try {
    const res = await fetch(`${apiUrl}/user/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir endereço" }, { status: 500 });
  }
}
